import { supabase } from '~/lib/supabase';
import type {
  Note,
  CreateNoteData,
  UpdateNoteData,
  DatabaseResponse,
  DatabaseListResponse,
  NoteFilters,
} from '~/types/database';

export class NotesService {
  private static tableName = 'notes';

  // Create a new note
  static async createNote(data: CreateNoteData): Promise<DatabaseResponse<Note>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data: note, error } = await supabase
        .from(this.tableName)
        .insert({
          title: data.title,
          content: data.content,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Create note error:', error);
        return { data: null, error: error.message };
      }

      return { data: note, error: null };
    } catch (error) {
      console.error('Create note error:', error);
      return { data: null, error: 'Failed to create note' };
    }
  }

  // Get all notes for the current user
  static async getNotes(filters: NoteFilters = {}): Promise<DatabaseListResponse<Note>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: [], error: 'User not authenticated' };
      }

      let query = supabase
        .from(this.tableName)
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Apply search filter
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data: notes, error } = await query;

      if (error) {
        console.error('Get notes error:', error);
        return { data: [], error: error.message };
      }

      return { data: notes || [], error: null };
    } catch (error) {
      console.error('Get notes error:', error);
      return { data: [], error: 'Failed to fetch notes' };
    }
  }

  // Get a single note by ID
  static async getNoteById(id: string): Promise<DatabaseResponse<Note>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data: note, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Get note error:', error);
        return { data: null, error: error.message };
      }

      return { data: note, error: null };
    } catch (error) {
      console.error('Get note error:', error);
      return { data: null, error: 'Failed to fetch note' };
    }
  }

  // Update a note
  static async updateNote(id: string, data: UpdateNoteData): Promise<DatabaseResponse<Note>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (data.title !== undefined) updateData.title = data.title;
      if (data.content !== undefined) updateData.content = data.content;

      const { data: note, error } = await supabase
        .from(this.tableName)
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Update note error:', error);
        return { data: null, error: error.message };
      }

      return { data: note, error: null };
    } catch (error) {
      console.error('Update note error:', error);
      return { data: null, error: 'Failed to update note' };
    }
  }

  // Delete a note
  static async deleteNote(id: string): Promise<DatabaseResponse<boolean>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Delete note error:', error);
        return { data: null, error: error.message };
      }

      return { data: true, error: null };
    } catch (error) {
      console.error('Delete note error:', error);
      return { data: null, error: 'Failed to delete note' };
    }
  }

  // Get notes count for pagination
  static async getNotesCount(search?: string): Promise<DatabaseResponse<number>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      let query = supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
      }

      const { count, error } = await query;

      if (error) {
        console.error('Get notes count error:', error);
        return { data: null, error: error.message };
      }

      return { data: count || 0, error: null };
    } catch (error) {
      console.error('Get notes count error:', error);
      return { data: null, error: 'Failed to get notes count' };
    }
  }
}