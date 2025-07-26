import { useQuery } from '@tanstack/react-query';
import { NotesService } from '~/services';
import type { NoteFilters } from '~/types/database';

const NOTES_QUERY_KEY = 'notes';

export function useNotesQuery(filters: NoteFilters = {}) {
  return useQuery({
    queryKey: [NOTES_QUERY_KEY, filters],
    queryFn: () => NotesService.getNotes(filters),
    select: (data) => data.data || [],
  });
}

export function useNoteQuery(id: string) {
  return useQuery({
    queryKey: [NOTES_QUERY_KEY, id],
    queryFn: () => NotesService.getNoteById(id),
    select: (data) => data.data,
    enabled: !!id,
  });
}