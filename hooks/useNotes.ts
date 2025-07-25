import { useState, useCallback } from 'react';
import { NotesService } from '~/lib/supabase-crud';
import type { Note, NoteFilters } from '~/types/database';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = useCallback(async (filters: NoteFilters = {}) => {
    setLoading(true);
    setError(null);
    
    const { data, error: fetchError } = await NotesService.getNotes(filters);
    
    if (fetchError) {
      setError(fetchError);
      setNotes([]);
    } else {
      setNotes(data);
    }
    
    setLoading(false);
  }, []);

  const createNote = useCallback(async (title: string, content: string) => {
    setError(null);
    
    const { data, error: createError } = await NotesService.createNote({
      title,
      content,
    });
    
    if (createError) {
      setError(createError);
      return { success: false, error: createError };
    }
    
    if (data) {
      setNotes(prev => [data, ...prev]);
    }
    
    return { success: true, data };
  }, []);

  const updateNote = useCallback(async (id: string, title: string, content: string) => {
    setError(null);
    
    const { data, error: updateError } = await NotesService.updateNote(id, {
      title,
      content,
    });
    
    if (updateError) {
      setError(updateError);
      return { success: false, error: updateError };
    }
    
    if (data) {
      setNotes(prev => prev.map(note => 
        note.id === id ? data : note
      ));
    }
    
    return { success: true, data };
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    setError(null);
    
    const { error: deleteError } = await NotesService.deleteNote(id);
    
    if (deleteError) {
      setError(deleteError);
      return { success: false, error: deleteError };
    }
    
    setNotes(prev => prev.filter(note => note.id !== id));
    return { success: true };
  }, []);

  const getNote = useCallback(async (id: string) => {
    setError(null);
    
    const { data, error: fetchError } = await NotesService.getNoteById(id);
    
    if (fetchError) {
      setError(fetchError);
      return { success: false, error: fetchError };
    }
    
    return { success: true, data };
  }, []);

  return {
    notes,
    loading,
    error,
    loadNotes,
    createNote,
    updateNote,
    deleteNote,
    getNote,
  };
}