import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Milestone, Resource, RoadmapData, ResourceType, ResourceDifficulty } from '@/types/roadmap';
import { initialRoadmapData } from '@/data/sampleRoadmap';
import { useToast } from '@/components/ui/use-toast';

// Extended type with metadata
interface ResourceWithMetadata extends Resource {
  lastUpdated?: string; // ISO date string
}

// Stats interface for calculating roadmap statistics
interface RoadmapStats {
  totalResources: number;
  completedResources: number;
  favoriteResources: number;
  progressPercentage: number;
  difficultyStats: {
    beginner: { total: number; completed: number };
    intermediate: { total: number; completed: number };
    advanced: { total: number; completed: number };
  };
  typeStats: Record<ResourceType, { total: number; completed: number }>;
  recentlyCompleted: Array<ResourceWithMetadata & { milestoneId: string; milestoneName: string }>;
}

interface RoadmapContextType {
  roadmap: RoadmapData;
  setRoadmap: React.Dispatch<React.SetStateAction<RoadmapData>>;
  addMilestone: (milestone: Omit<Milestone, 'id' | 'resources'>) => void;
  updateMilestone: (id: string, milestone: Partial<Milestone>) => void;
  deleteMilestone: (id: string) => void;
  moveMilestone: (fromIndex: number, toIndex: number) => void;
  addResource: (milestoneId: string, resource: Omit<Resource, 'id'>) => void;
  updateResource: (milestoneId: string, resourceId: string, resource: Partial<Resource>) => void;
  deleteResource: (milestoneId: string, resourceId: string) => void;
  toggleMilestoneExpansion: (id: string) => void;
  toggleResourceCompletion: (milestoneId: string, resourceId: string) => void;
  toggleResourceFavorite: (milestoneId: string, resourceId: string) => void;
  markAllResourcesComplete: (milestoneId: string, complete: boolean) => void;
  exportData: () => string;
  importData: (jsonData: string) => void;
  searchResources: (query: string) => Milestone[];
  getRoadmapStats: () => RoadmapStats;
}

const RoadmapContext = createContext<RoadmapContextType | undefined>(undefined);

export const RoadmapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roadmap, setRoadmap] = useState<RoadmapData>(initialRoadmapData);
  const { toast } = useToast();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('bioinformatics-roadmap');
    if (savedData) {
      try {
        setRoadmap(JSON.parse(savedData));
      } catch (err) {
        console.error("Error loading roadmap data from localStorage:", err);
        toast({
          title: "Error Loading Data",
          description: "Could not load saved data. Using default roadmap.",
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('bioinformatics-roadmap', JSON.stringify(roadmap));
  }, [roadmap]);

  // Generate a unique ID (simple implementation)
  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Add a new milestone
  const addMilestone = (milestone: Omit<Milestone, 'id' | 'resources'>) => {
    const newMilestone: Milestone = {
      ...milestone,
      id: generateId(),
      resources: [],
      isExpanded: true
    };
    
    setRoadmap(prev => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone]
    }));
    
    toast({
      title: "Milestone Added",
      description: `"${milestone.title}" has been added to your roadmap.`
    });
  };

  // Update an existing milestone
  const updateMilestone = (id: string, milestone: Partial<Milestone>) => {
    setRoadmap(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => 
        m.id === id 
          ? { ...m, ...milestone } 
          : m
      )
    }));
  };

  // Delete a milestone
  const deleteMilestone = (id: string) => {
    setRoadmap(prev => ({
      ...prev,
      milestones: prev.milestones.filter(m => m.id !== id)
    }));
    
    toast({
      title: "Milestone Deleted",
      description: "The milestone has been removed from your roadmap."
    });
  };

  // Move a milestone (reorder)
  const moveMilestone = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    setRoadmap(prev => {
      const newMilestones = [...prev.milestones];
      const [movedItem] = newMilestones.splice(fromIndex, 1);
      newMilestones.splice(toIndex, 0, movedItem);
      
      return {
        ...prev,
        milestones: newMilestones
      };
    });
  };

  // Add a resource to a milestone
  const addResource = (milestoneId: string, resource: Omit<Resource, 'id'>) => {
    const newResource: ResourceWithMetadata = {
      ...resource,
      id: generateId(),
      completed: false,
      favorite: false,
      lastUpdated: new Date().toISOString()
    };
    
    setRoadmap(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => 
        m.id === milestoneId 
          ? { ...m, resources: [...m.resources, newResource] } 
          : m
      )
    }));
    
    toast({
      title: "Resource Added",
      description: `"${resource.title}" has been added.`
    });
  };

  // Update a resource
  const updateResource = (milestoneId: string, resourceId: string, resource: Partial<Resource>) => {
    setRoadmap(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => 
        m.id === milestoneId 
          ? { 
              ...m, 
              resources: m.resources.map(r => 
                r.id === resourceId 
                  ? { 
                      ...r, 
                      ...resource,
                      lastUpdated: new Date().toISOString() 
                    } 
                  : r
              ) 
            } 
          : m
      )
    }));
  };

  // Delete a resource
  const deleteResource = (milestoneId: string, resourceId: string) => {
    setRoadmap(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => 
        m.id === milestoneId 
          ? { ...m, resources: m.resources.filter(r => r.id !== resourceId) } 
          : m
      )
    }));
    
    toast({
      title: "Resource Deleted",
      description: "The resource has been removed."
    });
  };

  // Toggle milestone expansion
  const toggleMilestoneExpansion = (id: string) => {
    setRoadmap(prev => ({
      ...prev,
      milestones: prev.milestones.map(m => 
        m.id === id 
          ? { ...m, isExpanded: !m.isExpanded } 
          : m
      )
    }));
  };

  // Toggle resource completion status
  const toggleResourceCompletion = (milestoneId: string, resourceId: string) => {
    setRoadmap(prev => {
      const milestone = prev.milestones.find(m => m.id === milestoneId);
      const resource = milestone?.resources.find(r => r.id === resourceId);
      const newCompletedState = resource ? !resource.completed : false;
      
      // Toggle completion notification only when marking as complete
      if (newCompletedState) {
        const resourceTitle = resource?.title || "Resource";
        const milestoneName = milestone?.title || "a milestone";
        
        toast({
          title: "Resource Completed",
          description: `"${resourceTitle}" from ${milestoneName} marked as complete!`,
          variant: "default"
        });
      }
      
      return {
        ...prev,
        milestones: prev.milestones.map(m => 
          m.id === milestoneId 
            ? { 
                ...m, 
                resources: m.resources.map(r => 
                  r.id === resourceId 
                    ? { 
                        ...r, 
                        completed: newCompletedState,
                        lastUpdated: new Date().toISOString() 
                      } 
                    : r
                ) 
              } 
            : m
        )
      };
    });
  };

  // Toggle resource favorite status
  const toggleResourceFavorite = (milestoneId: string, resourceId: string) => {
    setRoadmap(prev => {
      const milestone = prev.milestones.find(m => m.id === milestoneId);
      const resource = milestone?.resources.find(r => r.id === resourceId);
      const newFavoriteState = resource ? !resource.favorite : false;
      
      if (newFavoriteState) {
        const resourceTitle = resource?.title || "Resource";
        toast({
          title: "Added to Favorites",
          description: `"${resourceTitle}" added to your favorites.`,
          variant: "default"
        });
      }
      
      return {
        ...prev,
        milestones: prev.milestones.map(m => 
          m.id === milestoneId 
            ? { 
                ...m, 
                resources: m.resources.map(r => 
                  r.id === resourceId 
                    ? { 
                        ...r, 
                        favorite: newFavoriteState,
                        lastUpdated: new Date().toISOString() 
                      } 
                    : r
                ) 
              } 
            : m
        )
      };
    });
  };

  // Mark all resources in a milestone as complete/incomplete
  const markAllResourcesComplete = (milestoneId: string, complete: boolean) => {
    setRoadmap(prev => {
      const milestone = prev.milestones.find(m => m.id === milestoneId);
      const milestoneName = milestone?.title || "milestone";
      
      toast({
        title: complete ? "All Resources Completed" : "Resources Reset",
        description: `All resources in "${milestoneName}" ${complete ? 'marked as complete' : 'marked as incomplete'}.`,
        variant: "default"
      });
      
      return {
        ...prev,
        milestones: prev.milestones.map(m => 
          m.id === milestoneId 
            ? { 
                ...m, 
                resources: m.resources.map(r => ({ 
                  ...r, 
                  completed: complete,
                  lastUpdated: new Date().toISOString() 
                })) 
              } 
            : m
        )
      };
    });
  };

  // Global search function that returns milestones containing matching resources
  const searchResources = (query: string): Milestone[] => {
    if (!query.trim()) return roadmap.milestones;
    
    const normalizedQuery = query.toLowerCase().trim();
    
    return roadmap.milestones.filter(milestone => {
      // Check if milestone title/description matches
      if (
        milestone.title.toLowerCase().includes(normalizedQuery) ||
        milestone.description.toLowerCase().includes(normalizedQuery)
      ) {
        return true;
      }
      
      // Check if any resources match
      return milestone.resources.some(resource => 
        resource.title.toLowerCase().includes(normalizedQuery) ||
        resource.description.toLowerCase().includes(normalizedQuery) ||
        resource.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))
      );
    });
  };

  // Calculate roadmap statistics
  const getRoadmapStats = (): RoadmapStats => {
    const totalResources = roadmap.milestones.reduce(
      (count, milestone) => count + milestone.resources.length, 
      0
    );
    
    const completedResources = roadmap.milestones.reduce(
      (count, milestone) => count + milestone.resources.filter(r => r.completed).length, 
      0
    );
    
    const favoriteResources = roadmap.milestones.reduce(
      (count, milestone) => count + milestone.resources.filter(r => r.favorite).length, 
      0
    );
    
    // Difficulty stats
    const difficultyStats = {
      beginner: { total: 0, completed: 0 },
      intermediate: { total: 0, completed: 0 },
      advanced: { total: 0, completed: 0 }
    };
    
    // Type stats
    const typeStats: Record<ResourceType, { total: number; completed: number }> = {
      article: { total: 0, completed: 0 },
      video: { total: 0, completed: 0 },
      tutorial: { total: 0, completed: 0 },
      dataset: { total: 0, completed: 0 },
      quiz: { total: 0, completed: 0 }
    };
    
    // Collect recently completed resources
    const allResources: Array<ResourceWithMetadata & { milestoneId: string; milestoneName: string }> = [];
    
    roadmap.milestones.forEach(milestone => {
      milestone.resources.forEach(resource => {
        // Add to all resources array
        if (resource.completed) {
          allResources.push({
            ...resource,
            milestoneId: milestone.id,
            milestoneName: milestone.title
          });
        }
        
        // Count by difficulty
        if (resource.difficulty && difficultyStats[resource.difficulty]) {
          difficultyStats[resource.difficulty].total++;
          if (resource.completed) {
            difficultyStats[resource.difficulty].completed++;
          }
        }
        
        // Count by type
        if (resource.type && typeStats[resource.type]) {
          typeStats[resource.type].total++;
          if (resource.completed) {
            typeStats[resource.type].completed++;
          }
        }
      });
    });
    
    // Sort by lastUpdated (most recent first) and take top 5
    const recentlyCompleted = allResources
      .sort((a, b) => {
        const dateA = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
        const dateB = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, 5);
    
    return {
      totalResources,
      completedResources,
      favoriteResources,
      progressPercentage: totalResources > 0 
        ? Math.round((completedResources / totalResources) * 100) 
        : 0,
      difficultyStats,
      typeStats,
      recentlyCompleted
    };
  };

  // Export data as JSON
  const exportData = (): string => {
    return JSON.stringify(roadmap, null, 2);
  };

  // Import data from JSON with enhanced validation
  const importData = (jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData);
      
      // Basic schema validation
      if (!parsedData.title || typeof parsedData.title !== 'string') {
        throw new Error("Missing or invalid 'title' field");
      }
      
      if (!parsedData.description || typeof parsedData.description !== 'string') {
        throw new Error("Missing or invalid 'description' field");
      }
      
      if (!Array.isArray(parsedData.milestones)) {
        throw new Error("Missing or invalid 'milestones' array");
      }
      
      // Validate each milestone
      parsedData.milestones.forEach((milestone: any, index: number) => {
        if (!milestone.id || typeof milestone.id !== 'string') {
          throw new Error(`Milestone at index ${index} has missing or invalid 'id'`);
        }
        
        if (!milestone.title || typeof milestone.title !== 'string') {
          throw new Error(`Milestone at index ${index} has missing or invalid 'title'`);
        }
        
        if (!Array.isArray(milestone.resources)) {
          throw new Error(`Milestone at index ${index} has missing or invalid 'resources' array`);
        }
        
        // Validate each resource
        milestone.resources.forEach((resource: any, resIndex: number) => {
          if (!resource.id || typeof resource.id !== 'string') {
            throw new Error(`Resource at index ${resIndex} in milestone "${milestone.title}" has missing or invalid 'id'`);
          }
          
          if (!resource.title || typeof resource.title !== 'string') {
            throw new Error(`Resource at index ${resIndex} in milestone "${milestone.title}" has missing or invalid 'title'`);
          }
          
          if (!resource.url || typeof resource.url !== 'string') {
            throw new Error(`Resource at index ${resIndex} in milestone "${milestone.title}" has missing or invalid 'url'`);
          }
          
          if (!Array.isArray(resource.tags)) {
            throw new Error(`Resource at index ${resIndex} in milestone "${milestone.title}" has missing or invalid 'tags' array`);
          }
        });
      });
      
      // If we reached here, data passed basic validation
      setRoadmap(parsedData);
      
      toast({
        title: "Data Imported",
        description: `Imported roadmap "${parsedData.title}" with ${parsedData.milestones.length} milestones.`,
        variant: "default"
      });
    } catch (err) {
      console.error("Error importing roadmap data:", err);
      toast({
        title: "Import Failed",
        description: err instanceof Error ? err.message : "Could not import data. Please check the JSON format.",
        variant: "destructive"
      });
      throw err; // Re-throw to allow handling in the UI
    }
  };

  // Context value with memoization to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    roadmap,
    setRoadmap,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    moveMilestone,
    addResource,
    updateResource,
    deleteResource,
    toggleMilestoneExpansion,
    toggleResourceCompletion,
    toggleResourceFavorite,
    markAllResourcesComplete,
    exportData,
    importData,
    searchResources,
    getRoadmapStats
  }), [roadmap]);

  return (
    <RoadmapContext.Provider value={contextValue}>
      {children}
    </RoadmapContext.Provider>
  );
};

export const useRoadmap = (): RoadmapContextType => {
  const context = useContext(RoadmapContext);
  if (context === undefined) {
    throw new Error('useRoadmap must be used within a RoadmapProvider');
  }
  return context;
};