
export type ResourceType =
  | 'book'
  | 'course'
  | 'documentation'
  | 'database'
  | 'project'
  | 'article'
  | 'video'
  | 'tutorial'
  | 'dataset'
  | 'quiz';

export type ResourceDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  difficulty: ResourceDifficulty;
  tags: string[];
  completed?: boolean;
  favorite?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  resources: Resource[];
  isExpanded?: boolean;
}

export interface RoadmapData {
  title: string;
  description: string;
  milestones: Milestone[];
}
