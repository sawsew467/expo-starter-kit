import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NotesService } from '~/services';

const NOTES_QUERY_KEY = 'notes';

export function useCreateNoteMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { title: string; content: string }) => 
      NotesService.createNote(data),
    onSuccess: () => {
      // Invalidate and refetch notes
      queryClient.invalidateQueries({ queryKey: [NOTES_QUERY_KEY] });
    },
  });
}

export function useUpdateNoteMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title: string; content: string } }) =>
      NotesService.updateNote(id, data),
    onSuccess: (result, variables) => {
      // Update the specific note in cache
      queryClient.setQueryData([NOTES_QUERY_KEY, variables.id], result);
      // Invalidate notes list to refetch
      queryClient.invalidateQueries({ queryKey: [NOTES_QUERY_KEY] });
    },
  });
}

export function useDeleteNoteMutation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => NotesService.deleteNote(id),
    onSuccess: (_, id) => {
      // Remove the note from cache
      queryClient.removeQueries({ queryKey: [NOTES_QUERY_KEY, id] });
      // Invalidate notes list to refetch
      queryClient.invalidateQueries({ queryKey: [NOTES_QUERY_KEY] });
    },
  });
}