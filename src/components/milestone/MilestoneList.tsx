import React, { useState } from 'react';
import { MilestoneCard } from '@/components/milestone/MilestoneCard';
import { useRoadmap } from '@/context/RoadmapContext';
import { 
  DndContext, 
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  closestCenter,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Button } from '@/components/ui/button';
import { Plus, ArrowDownUp, CheckSquare, Star } from 'lucide-react';
import { Milestone } from '@/types/roadmap';
import { NewMilestoneForm } from '@/components/milestone/NewMilestoneForm';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MilestoneListProps {
  milestones?: Milestone[];
}

export function MilestoneList({ milestones }: MilestoneListProps) {
  const { roadmap, moveMilestone } = useRoadmap();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isAddMilestoneDialogOpen, setIsAddMilestoneDialogOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string>('index');
  
  // Use provided milestones or default to all roadmap milestones
  const displayMilestones = milestones || roadmap.milestones;
  
  // Apply sorting
  const getSortedMilestones = () => {
    if (sortOption === 'index') {
      return [...displayMilestones]; // Already in index order
    } else if (sortOption === 'progress') {
      return [...displayMilestones].sort((a, b) => {
        const progressA = a.resources.length > 0 
          ? a.resources.filter(r => r.completed).length / a.resources.length 
          : 0;
        const progressB = b.resources.length > 0 
          ? b.resources.filter(r => r.completed).length / b.resources.length 
          : 0;
        return progressB - progressA; // Descending order
      });
    } else if (sortOption === 'favorites') {
      return [...displayMilestones].sort((a, b) => {
        const favCountA = a.resources.filter(r => r.favorite).length;
        const favCountB = b.resources.filter(r => r.favorite).length;
        return favCountB - favCountA; // Descending order
      });
    }
    return displayMilestones;
  };
  
  const sortedMilestones = getSortedMilestones();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );
  
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    // Reset to index sorting when dragging
    if (sortOption !== 'index') {
      setSortOption('index');
    }
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = roadmap.milestones.findIndex(m => m.id === active.id);
      const newIndex = roadmap.milestones.findIndex(m => m.id === over.id);
      
      moveMilestone(oldIndex, newIndex);
    }
    
    setActiveId(null);
  };
  
  const activeMilestone = activeId 
    ? roadmap.milestones.find((milestone) => milestone.id === activeId) 
    : null;
  
  // Only allow drag sorting in "index" mode and when not filtered
  const isDragSortingEnabled = sortOption === 'index' && !milestones;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Milestones</h2>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <ArrowDownUp size={14} />
                <span className="hidden sm:inline">Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Sort Milestones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem 
                  onClick={() => setSortOption('index')}
                  className={sortOption === 'index' ? 'bg-accent' : ''}
                >
                  <span>Original Order</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortOption('progress')}
                  className={sortOption === 'progress' ? 'bg-accent' : ''}
                >
                  <CheckSquare size={14} className="mr-2" />
                  <span>Completion Progress</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setSortOption('favorites')}
                  className={sortOption === 'favorites' ? 'bg-accent' : ''}
                >
                  <Star size={14} className="mr-2" />
                  <span>Favorite Count</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={isAddMilestoneDialogOpen} onOpenChange={setIsAddMilestoneDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus size={16} className="mr-1" /> 
                <span className="hidden sm:inline">Add Milestone</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Milestone</DialogTitle>
                <DialogDescription>
                  Create a new milestone for your bioinformatics learning journey.
                </DialogDescription>
              </DialogHeader>
              <NewMilestoneForm onComplete={() => setIsAddMilestoneDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {sortOption !== 'index' && (
        <div className="px-3 py-2 bg-muted rounded-md text-sm flex items-center justify-between">
          <span>
            Showing milestones sorted by {' '}
            <span className="font-medium">
              {sortOption === 'progress' ? 'completion progress' : 'favorite count'}
            </span>
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSortOption('index')}
            className="h-7 text-xs"
          >
            Reset
          </Button>
        </div>
      )}
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
        // Disable drag-and-drop when sorting by a specific criteria or when filtered
        disabled={!isDragSortingEnabled}
      >
        <SortableContext
          items={sortedMilestones.map((milestone) => milestone.id)}
          strategy={verticalListSortingStrategy}
          disabled={!isDragSortingEnabled}
        >
          {sortedMilestones.map((milestone, index) => (
            <MilestoneCard 
              key={milestone.id} 
              milestone={milestone} 
              index={isDragSortingEnabled ? index : roadmap.milestones.findIndex(m => m.id === milestone.id)} 
            />
          ))}
        </SortableContext>
        
        <DragOverlay>
          {activeId && activeMilestone ? (
            <div className="opacity-80">
              <MilestoneCard 
                milestone={activeMilestone} 
                index={roadmap.milestones.findIndex(m => m.id === activeId)} 
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      
      {displayMilestones.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-medium text-muted-foreground mb-2">No milestones found</h3>
          <p className="text-muted-foreground mb-4">
            {milestones 
              ? "No milestones match your search criteria." 
              : "Add your first milestone to start building your roadmap."}
          </p>
          {!milestones && (
            <Button onClick={() => setIsAddMilestoneDialogOpen(true)}>
              <Plus size={16} className="mr-1" /> Add First Milestone
            </Button>
          )}
        </div>
      )}
    </div>
  );
}