import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Pencil,
  Trash2,
  ExternalLink,
  BookOpen,
  Video,
  FolderOpen,
  Database,
  HelpCircle,
  Star,
  Check,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Resource, ResourceType, ResourceDifficulty } from '@/types/roadmap';
import { useRoadmap } from '@/context/RoadmapContext';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ResourceCardProps {
  resource: Resource;
  milestoneId: string;
}

export function ResourceCard({ resource, milestoneId }: ResourceCardProps) {
  const { updateResource, deleteResource, toggleResourceCompletion, toggleResourceFavorite } = useRoadmap();
  const [isEditing, setIsEditing] = useState(false);
  const [editedResource, setEditedResource] = useState<Resource>({ ...resource });
  const [newTag, setNewTag] = useState('');

  const resourceTypeIcons: Record<ResourceType, React.ReactNode> = {
    article: <BookOpen size={16} />,
    video: <Video size={16} />,
    tutorial: <FolderOpen size={16} />,
    dataset: <Database size={16} />,
    quiz: <HelpCircle size={16} />,
    book: '',
    course: '',
    documentation: '',
    database: '',
    project: ''
  };

  const difficultyColors: Record<ResourceDifficulty, string> = {
    beginner: 'bg-bio-green-100 text-bio-green-800 border-bio-green-200',
    intermediate: 'bg-bio-blue-100 text-bio-blue-800 border-bio-blue-200',
    advanced: 'bg-bio-purple-100 text-bio-purple-800 border-bio-purple-200'
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${resource.title}"?`)) {
      deleteResource(milestoneId, resource.id);
    }
  };

  const handleSaveEdit = () => {
    updateResource(milestoneId, resource.id, editedResource);
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !editedResource.tags.includes(newTag.trim())) {
      setEditedResource({
        ...editedResource,
        tags: [...editedResource.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedResource({
      ...editedResource,
      tags: editedResource.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedResource({
      ...editedResource,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditedResource({
      ...editedResource,
      [name]: value
    });
  };

  return (
    <Card className={`transition-all duration-300 ${resource.completed ? 'border-l-4 border-l-success' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <div className="mt-1 text-muted-foreground">
              {resourceTypeIcons[resource.type]}
            </div>
            <div>
              <CardTitle className="text-base">
                {resource.title}
              </CardTitle>
              <CardDescription className="line-clamp-2 mt-1">
                {resource.description}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex space-x-1 ml-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleResourceCompletion(milestoneId, resource.id)}
                    className={resource.completed ? 'text-success' : 'text-muted-foreground hover:text-success'}
                  >
                    <Check size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{resource.completed ? 'Mark as incomplete' : 'Mark as complete'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleResourceFavorite(milestoneId, resource.id)}
                    className={resource.favorite ? 'text-warning' : 'text-muted-foreground hover:text-warning'}
                  >
                    <Star size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{resource.favorite ? 'Remove from favorites' : 'Add to favorites'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-1 mb-2">
          <Badge variant="outline" className={`text-xs ${difficultyColors[resource.difficulty]}`}>
            {resource.difficulty}
          </Badge>
          
          {resource.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-0">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground  ">{resource.title}</span>
          <a 
            href={resource.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-primary text-xs flex items-center hover:underline"
          >
            Visit Resource <ExternalLink size={10} className="ml-1" />
          </a>
        </div>
        
        <div className="flex space-x-1">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Pencil size={16} />
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Resource</DialogTitle>
                <DialogDescription>
                  Make changes to the resource details.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={editedResource.title}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={editedResource.description}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    name="url"
                    type="url"
                    value={editedResource.url}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Resource Type</Label>
                    <Select
                      value={editedResource.type}
                      onValueChange={(value) => handleSelectChange('type', value as ResourceType)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="tutorial">Tutorial</SelectItem>
                        <SelectItem value="dataset">Dataset / Tool</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select
                      value={editedResource.difficulty}
                      onValueChange={(value) => handleSelectChange('difficulty', value as ResourceDifficulty)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      id="new-tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                    />
                    <Button type="button" onClick={handleAddTag}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {editedResource.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <X 
                          size={12} 
                          className="cursor-pointer" 
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="button" onClick={handleSaveEdit}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDelete}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}