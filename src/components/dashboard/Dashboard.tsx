import React, { useState, useEffect } from 'react';
import { useRoadmap } from '@/context/RoadmapContext';
import { MilestoneList } from '@/components/milestone/MilestoneList';
import { Navigation } from '@/components/layout/Navigation';
import { 
  X,
  Info,
  BookMarked,
  Star,
  CheckCircle
} from 'lucide-react';
import {
  Card, 
  CardContent
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';

export function Dashboard() {
  const { roadmap, exportData, importData, searchResources, getRoadmapStats } = useRoadmap();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [globalSearch, setGlobalSearch] = useState('');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const isMobile = useIsMobile();
  
  // Auto-close sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);
  
  // Get filtered milestones based on search
  const filteredMilestones = globalSearch 
    ? searchResources(globalSearch)
    : roadmap.milestones;
  
  // Get roadmap stats
  const stats = getRoadmapStats();
  
  // Handle export
  const handleExport = () => {
    const jsonString = exportData();
    
    // Create a blob and download it
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bioinformatics-roadmap.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: "Your roadmap data has been exported as JSON.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation Component */}
      <Navigation 
        title={roadmap.title}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        globalSearch={globalSearch}
        setGlobalSearch={setGlobalSearch}
        onExport={handleExport}
        onImport={importData}
      />
      
      {/* Main content - with padding-top to account for fixed header */}
      <div className="flex flex-1 pt-[104px] md:pt-16">
        {/* Sidebar - using fixed positioning for mobile */}
        {isSidebarOpen && (
          <>
            {/* Mobile overlay */}
            {isMobile && (
              <div 
                className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
            
            {/* Actual sidebar */}
            <aside className={`w-72 border-r bg-muted/40 overflow-y-auto ${
              isMobile 
                ? 'fixed left-0 top-0 bottom-0 z-40 shadow-lg animate-in slide-in-from-left pt-[104px]' 
                : 'relative'
            }`}>
              {/* Mobile close button */}
              {isMobile && (
                <Button 
                  className="absolute top-[112px] right-3" 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X size={18} />
                </Button>
              )}
              
              <div className="p-4 space-y-4 fixed top-[70px] bottom-0 w-72  z-40 bg-muted/40 border-r overflow-y-auto">
              <Tabs  value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <h2 className="text-lg font-semibold mb-2">Roadmap Summary</h2>
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Milestones</p>
                          <p className="text-2xl font-bold">{roadmap.milestones.length}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-muted-foreground">Resources</p>
                          <p className="text-2xl font-bold">{stats.totalResources}</p>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-sm text-muted-foreground">Progress</p>
                            <Badge variant="outline">
                              {stats.completedResources}/{stats.totalResources}
                            </Badge>
                          </div>
                          <Progress 
                            value={stats.progressPercentage} 
                            className="h-2" 
                          />
                          <p className="text-right text-sm mt-1">
                            {stats.progressPercentage}%
                          </p>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-foreground">Favorites</p>
                            <Badge variant="outline" className="text-warning">
                              <Star size={12} className="mr-1" />
                              {stats.favoriteResources}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {stats.recentlyCompleted.length > 0 && (
                      <>
                        <h2 className="text-lg font-semibold mt-4 mb-2">Recent Progress</h2>
                        <div className="space-y-2">
                          {stats.recentlyCompleted.map((resource) => (
                            <Card key={resource.id} className="overflow-hidden">
                              <div className="border-l-4 border-success p-3">
                                <div className="flex items-start gap-2">
                                  <CheckCircle size={16} className="text-success mt-0.5" />
                                  <div>
                                    <p className="font-medium text-sm">{resource.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                      from {resource.milestoneName}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="details" className="space-y-4 mt-4">
                    <h2 className="text-lg font-semibold mb-2">Progress by Difficulty</h2>
                    <div className="space-y-3">
                      {(Object.keys(stats.difficultyStats) as Array<keyof typeof stats.difficultyStats>).map((difficulty) => {
                        const diffStats = stats.difficultyStats[difficulty];
                        if (!diffStats) return null;
                        
                        return (
                          <div key={difficulty}>
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center">
                                <Badge 
                                  variant="outline" 
                                  className="mr-2 capitalize"
                                >
                                  {difficulty}
                                </Badge>
                                <span className="text-xs">
                                  {diffStats.completed}/{diffStats.total}
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {diffStats.total > 0 ? Math.round((diffStats.completed / diffStats.total) * 100) : 0}%
                              </span>
                            </div>
                            <Progress 
                              value={diffStats.total > 0 ? (diffStats.completed / diffStats.total) * 100 : 0} 
                              className="h-2"
                            />
                          </div>
                        );
                      })}
                    </div>
                    
                    <h2 className="text-lg font-semibold mt-4 mb-2">Resource Types</h2>
                    <div className="space-y-2">
                      {(Object.keys(stats.typeStats) as Array<keyof typeof stats.typeStats>).map(type => {
                        const typeStats = stats.typeStats[type];
                        if (!typeStats || typeStats.total === 0) return null;
                        
                        return (
                          <div key={type} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="capitalize">{type}</span>
                            </div>
                            <Badge variant="outline">
                              {typeStats.completed}/{typeStats.total}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                </Tabs>
                
                <Separator />
                
                <div>
                <a
                  href="/about"
                  className="text-lg mb-8 font-semibold text-gray-700 border-b-2 border-blue-600 leading-none pb-0.1"
                  >
                  About
                </a>
                  <p className="text-sm mt-2 text-muted-foreground mb-2">
                    This interactive roadmap helps you organize your bioinformatics learning journey.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Add milestones, resources, and track your progress as you learn.
                  </p>
                  
                  <div className="mt-4 pt-2 border-t">
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Info size={12} className="mr-1" /> Created by GeneR
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <BookMarked size={12} className="mr-1" /> Data is stored locally in your browser
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </>
        )}
        
        {/* Main Content */}
        <main className={`flex-1 p-3 md:p-6 overflow-y-auto ${isSidebarOpen && !isMobile ? 'md:ml-0' : 'w-full'}`}>
          <div className="container mx-auto max-w-4xl">
            {globalSearch && (
              <div className="bg-muted/50 p-3 rounded-lg mb-4 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">Search results for: </span>
                  <span className="text-sm font-bold">"{globalSearch}"</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setGlobalSearch('')}
                  className="h-7 gap-1"
                >
                  <X size={14} /> Clear
                </Button>
              </div>
            )}
            
            <div className="bg-card rounded-lg shadow p-3 md:p-6">
              <div className="mb-4 md:mb-6">
                <h1 className="text-xl md:text-3xl font-bold">{roadmap.title}</h1>
                <p className="text-muted-foreground mt-2">{roadmap.description}</p>
                
                {!isMobile && (
                  <div className="flex items-center mt-4 space-x-4">
                    <div className="flex items-center">
                      <CheckCircle size={16} className="mr-2 text-success" />
                      <span>
                        <span className="font-medium">{stats.completedResources}</span> completed
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Star size={16} className="mr-2 text-warning" />
                      <span>
                        <span className="font-medium">{stats.favoriteResources}</span> favorites
                      </span>
                    </div>
                    <Progress 
                      value={stats.progressPercentage} 
                      className="h-2 flex-1" 
                    />
                    <span className="text-sm font-medium">
                      {stats.progressPercentage}%
                    </span>
                  </div>
                )}
              </div>
              
              <MilestoneList milestones={filteredMilestones} />
              
              {globalSearch && filteredMilestones.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No matching milestones or resources found</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setGlobalSearch('')}
                    className="mt-2"
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}