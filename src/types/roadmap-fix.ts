
import { ResourceType } from './roadmap';

// This is a utility to check if a string is a valid ResourceType
export function isValidResourceType(type: string): type is ResourceType {
  return ['article', 'video', 'tutorial', 'dataset', 'quiz'].includes(type as ResourceType);
}

// This will convert any string to a valid ResourceType or default to 'article'
export function ensureValidResourceType(type: string): ResourceType {
  return isValidResourceType(type) ? type : 'article';
}
