import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Story, StoryGenerationRequest } from '@shared/schema';

export function useStories() {
  return useQuery<Story[]>({
    queryKey: ['/api/stories'],
  });
}

export function useStory(id: number) {
  return useQuery<Story>({
    queryKey: ['/api/stories', id],
  });
}

export function useGenerateStory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: StoryGenerationRequest) => {
      const response = await apiRequest('POST', '/api/stories/generate', request);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stories'] });
    },
  });
}

export function useDeleteStory() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/stories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stories'] });
    },
  });
}

export function useCharacterSuggestions() {
  return useQuery({
    queryKey: ['/api/characters'],
  });
}

export function useGenerateCharacterSuggestions() {
  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/characters/suggest');
      return response.json();
    },
  });
}

export function usePreferences() {
  return useQuery({
    queryKey: ['/api/preferences'],
  });
}

export function useUpdatePreferences() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (preferences: any) => {
      const response = await apiRequest('PUT', '/api/preferences', preferences);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/preferences'] });
    },
  });
}
