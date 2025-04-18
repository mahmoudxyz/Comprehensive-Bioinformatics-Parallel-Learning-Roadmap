
import React, { useState } from 'react';
import { useRoadmap } from '@/context/RoadmapContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DialogClose } from '@/components/ui/dialog';

interface NewMilestoneFormProps {
  onComplete: () => void;
}

export function NewMilestoneForm({ onComplete }: NewMilestoneFormProps) {
  const { addMilestone } = useRoadmap();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    // Add the milestone
    addMilestone({
      title: title.trim(),
      description: description.trim()
    });
    
    // Reset form and close dialog
    setTitle('');
    setDescription('');
    setError(null);
    onComplete();
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Introduction to Genomics"
          autoFocus
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Briefly describe this milestone..."
          rows={3}
        />
      </div>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      
      <div className="flex justify-end gap-2 pt-2">
        <DialogClose asChild>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit">Create Milestone</Button>
      </div>
    </form>
  );
}
