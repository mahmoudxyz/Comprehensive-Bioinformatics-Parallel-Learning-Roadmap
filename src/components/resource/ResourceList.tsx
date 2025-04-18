import React, { useState, useEffect } from 'react';
import { Resource, ResourceType, ResourceDifficulty } from '@/types/roadmap';
import { ResourceCard } from '@/components/resource/ResourceCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, X, BookOpen, Video, FolderOpen, Database, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ResourceListProps {
  milestoneId: string;
  resources: Resource[];
}

export function ResourceList({ milestoneId, resources }: ResourceListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<{
    types: ResourceType[];
    difficulties: ResourceDifficulty[];
    tags: string[];
  }>({
    types: [],
    difficulties: [],
    tags: []
  });
  const [viewMode, setViewMode] = useState<'all' | 'completed' | 'favorites'>('all');

  // Get all unique tags from resources
  const allTags = [...new Set(resources.flatMap(resource => resource.tags))].sort();
  
  // Get all unique types and difficulties
  const resourceTypes = Array.from(
    new Set(resources.map((r) => r.type))
  ) as ResourceType[];
  
  const difficultyLevels = Array.from(
    new Set(resources.map((r) => r.difficulty))
  ) as ResourceDifficulty[];
    
  // Resource type icons map
  const resourceTypeIcons: Record<ResourceType, React.ReactNode> = {
    article: <BookOpen size={14} />,
    video: <Video size={14} />,
    tutorial: <FolderOpen size={14} />,
    dataset: <Database size={14} />,
    quiz: <HelpCircle size={14} />,
    book: '',
    course: '',
    documentation: '',
    database: '',
    project: ''
  };

  // Filter resources based on search term, active filters, and view mode
  const filteredResources = resources.filter(resource => {
    // Text search - include tags in search
    const matchesSearch = searchTerm === '' || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Type filter
    const matchesType = activeFilters.types.length === 0 || 
      activeFilters.types.includes(resource.type);
    
    // Difficulty filter
    const matchesDifficulty = activeFilters.difficulties.length === 0 || 
      activeFilters.difficulties.includes(resource.difficulty);
    
    // Tags filter
    const matchesTags = activeFilters.tags.length === 0 || 
      resource.tags.some(tag => activeFilters.tags.includes(tag));
    
    // View mode filter
    const matchesViewMode = 
      (viewMode === 'all') || 
      (viewMode === 'completed' && resource.completed) || 
      (viewMode === 'favorites' && resource.favorite);
    
    return matchesSearch && matchesType && matchesDifficulty && matchesTags && matchesViewMode;
  });

  // Stats for the view modes
  const completedCount = resources.filter(r => r.completed).length;
  const favoritesCount = resources.filter(r => r.favorite).length;

  const toggleTypeFilter = (type: ResourceType) => {
    setActiveFilters(prev => {
      if (prev.types.includes(type)) {
        return {
          ...prev,
          types: prev.types.filter(t => t !== type)
        };
      } else {
        return {
          ...prev,
          types: [...prev.types, type]
        };
      }
    });
  };

  const toggleDifficultyFilter = (difficulty: ResourceDifficulty) => {
    setActiveFilters(prev => {
      if (prev.difficulties.includes(difficulty)) {
        return {
          ...prev,
          difficulties: prev.difficulties.filter(d => d !== difficulty)
        };
      } else {
        return {
          ...prev,
          difficulties: [...prev.difficulties, difficulty]
        };
      }
    });
  };

  const toggleTagFilter = (tag: string) => {
    setActiveFilters(prev => {
      if (prev.tags.includes(tag)) {
        return {
          ...prev,
          tags: prev.tags.filter(t => t !== tag)
        };
      } else {
        return {
          ...prev,
          tags: [...prev.tags, tag]
        };
      }
    });
  };

  const clearFilters = () => {
    setActiveFilters({
      types: [],
      difficulties: [],
      tags: []
    });
    setSearchTerm('');
  };

  const hasActiveFilters = activeFilters.types.length > 0 || 
    activeFilters.difficulties.length > 0 || 
    activeFilters.tags.length > 0;

  // Clear filters when changing view modes
  useEffect(() => {
    clearFilters();
  }, [viewMode]);

  return (
    <div className="space-y-4">
      <Tabs 
        defaultValue="all" 
        value={viewMode} 
        onValueChange={(value) => setViewMode(value as 'all' | 'completed' | 'favorites')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            All Resources
            <Badge variant="outline" className="ml-2">{resources.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
            <Badge variant="outline" className="ml-2">{completedCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="favorites">
            Favorites
            <Badge variant="outline" className="ml-2">{favoritesCount}</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by title, description, or tags..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-1 top-1 h-7 w-7 p-0" 
              onClick={() => setSearchTerm('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1 shrink-0">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1">{
                  activeFilters.types.length + 
                  activeFilters.difficulties.length + 
                  activeFilters.tags.length
                }</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <div className="p-2">
              <h4 className="font-medium mb-1">Resource Type</h4>
              {resourceTypes.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={activeFilters.types.includes(type)}
                  onCheckedChange={() => toggleTypeFilter(type)}
                  className="capitalize"
                >
                  <div className="flex items-center">
                    <span className="mr-2">{resourceTypeIcons[type]}</span>
                    {type}
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
              
              <Separator className="my-2" />
              
              <h4 className="font-medium mb-1">Difficulty</h4>
              {difficultyLevels.map((difficulty) => (
                <DropdownMenuCheckboxItem
                  key={difficulty}
                  checked={activeFilters.difficulties.includes(difficulty)}
                  onCheckedChange={() => toggleDifficultyFilter(difficulty)}
                  className="capitalize"
                >
                  {difficulty}
                </DropdownMenuCheckboxItem>
              ))}
              
              {allTags.length > 0 && (
                <>
                  <Separator className="my-2" />
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium mb-1">Tags</h4>
                    <Badge variant="outline" className="text-xs">{allTags.length}</Badge>
                  </div>
                  <div className="max-h-32 overflow-y-auto pr-1">
                    {allTags.map((tag) => (
                      <DropdownMenuCheckboxItem
                        key={tag}
                        checked={activeFilters.tags.includes(tag)}
                        onCheckedChange={() => toggleTagFilter(tag)}
                      >
                        {tag}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </div>
                </>
              )}
              
              <Separator className="my-2" />
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-muted-foreground"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
              >
                Clear Filters
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Active filter badges - more compact on mobile */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1 md:gap-2">
          {activeFilters.types.map(type => (
            <Badge 
              key={`type-${type}`} 
              variant="secondary"
              className="px-2 py-0.5 text-xs md:text-sm cursor-pointer hover:opacity-80 flex items-center gap-1"
              onClick={() => toggleTypeFilter(type)}
            >
              {resourceTypeIcons[type]}
              {type}
              <X size={12} className="ml-1" />
            </Badge>
          ))}
          
          {activeFilters.difficulties.map(difficulty => (
            <Badge 
              key={`diff-${difficulty}`} 
              variant="secondary"
              className="px-2 py-0.5 text-xs md:text-sm cursor-pointer hover:opacity-80 flex items-center"
              onClick={() => toggleDifficultyFilter(difficulty)}
            >
              {difficulty} <X size={12} className="ml-1" />
            </Badge>
          ))}
          
          {activeFilters.tags.map(tag => (
            <Badge 
              key={`tag-${tag}`} 
              variant="secondary"
              className="px-2 py-0.5 text-xs md:text-sm cursor-pointer hover:opacity-80 flex items-center"
              onClick={() => toggleTagFilter(tag)}
            >
              {tag} <X size={12} className="ml-1" />
            </Badge>
          ))}

          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-muted-foreground h-6 px-2"
              onClick={clearFilters}
            >
              Clear all
            </Button>
          )}
        </div>
      )}
      
      {/* Resource list */}
      <div className="space-y-3">
        {filteredResources.length === 0 ? (
          <div className="text-center p-6 border rounded-md border-dashed bg-muted/50">
            <p className="text-muted-foreground mb-2">No resources match your criteria</p>
            {searchTerm && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSearchTerm('')}
                className="mr-2"
              >
                Clear search
              </Button>
            )}
            {hasActiveFilters && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          filteredResources.map((resource) => (
            <>

            <ResourceCard 
              key={resource.id} 
              resource={resource} 
              milestoneId={milestoneId} 
            />
                      {console.log(filteredResources)}

            </>
          ))
        )}
        
      </div>
      
      {filteredResources.length > 0 && (
        <div className="text-sm text-muted-foreground text-right">
          Showing {filteredResources.length} of {resources.length} resources
        </div>
      )}
    </div>
  );
}