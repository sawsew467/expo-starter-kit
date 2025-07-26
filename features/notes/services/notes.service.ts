import { supabase } from '~/lib/supabase';
import { ActivityService } from '../../profile/services/activity.service';
import type { ApiResponse, ApiListResponse } from '~/types/api';
import type {
  Note,
  CreateNoteDto,
  UpdateNoteDto,
  NoteFiltersDto,
} from '../types';
import { DEFAULT_CATEGORY, DEFAULT_NOTE_COLOR } from '../types/enums';
import { ActivityType } from '../../profile/types/enums';

export class NotesService {
  private static tableName = 'notes';

  // Create a new note
  static async createNote(data: CreateNoteDto): Promise<ApiResponse<Note>> {
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
          category: data.category || DEFAULT_CATEGORY,
          tags: data.tags || [],
          is_favorite: data.is_favorite || false,
          color: data.color || DEFAULT_NOTE_COLOR,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Create note error:', error);
        return { data: null, error: error.message };
      }

      // Create activity for note creation
      await ActivityService.createActivity({
        title: `Created note: ${data.title}`,
        type: ActivityType.NOTE_CREATED,
        related_id: note.id,
      });

      return { data: note, error: null };
    } catch (error) {
      console.error('Create note error:', error);
      return { data: null, error: 'Failed to create note' };
    }
  }

  // Get all notes for the current user
  static async getNotes(filters: NoteFiltersDto = {}): Promise<ApiListResponse<Note>> {
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
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%,tags.cs.{${filters.search}}`);
      }

      // Apply category filter
      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      // Apply favorite filter
      if (filters.is_favorite !== undefined) {
        query = query.eq('is_favorite', filters.is_favorite);
      }

      // Apply tags filter
      if (filters.tags && filters.tags.length > 0) {
        query = query.overlaps('tags', filters.tags);
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
  static async getNoteById(id: string): Promise<ApiResponse<Note>> {
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
  static async updateNote(id: string, data: UpdateNoteDto): Promise<ApiResponse<Note>> {
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
      if (data.category !== undefined) updateData.category = data.category;
      if (data.tags !== undefined) updateData.tags = data.tags;
      if (data.is_favorite !== undefined) updateData.is_favorite = data.is_favorite;
      if (data.color !== undefined) updateData.color = data.color;

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

      // Create activity for note update
      await ActivityService.createActivity({
        title: `Updated note: ${note.title}`,
        type: ActivityType.NOTE_UPDATED,
        related_id: note.id,
      });

      return { data: note, error: null };
    } catch (error) {
      console.error('Update note error:', error);
      return { data: null, error: 'Failed to update note' };
    }
  }

  // Delete a note
  static async deleteNote(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      // Get note title before deletion for activity
      const { data: noteToDelete } = await this.getNoteById(id);
      
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Delete note error:', error);
        return { data: null, error: error.message };
      }

      // Create activity for note deletion
      if (noteToDelete) {
        await ActivityService.createActivity({
          title: `Deleted note: ${noteToDelete.title}`,
          type: ActivityType.NOTE_DELETED,
          related_id: id,
        });
      }

      return { data: true, error: null };
    } catch (error) {
      console.error('Delete note error:', error);
      return { data: null, error: 'Failed to delete note' };
    }
  }

  // Get notes count for pagination
  static async getNotesCount(search?: string): Promise<ApiResponse<number>> {
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

  // Get user statistics
  static async getUserStats(): Promise<ApiResponse<{
    notes_count: number;
    favorite_notes_count: number;
    categories: string[];
    recent_activities_count: number;
  }>> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: 'User not authenticated' };
      }

      const { data: notes, error: notesError } = await supabase
        .from(this.tableName)
        .select('category, is_favorite')
        .eq('user_id', user.id);

      if (notesError) {
        console.error('Get user stats error:', notesError);
        return { data: null, error: notesError.message };
      }

      const { data: activities, error: activitiesError } = await supabase
        .from('activities')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // Last 7 days

      if (activitiesError) {
        console.error('Get activities count error:', activitiesError);
      }

      const categories = [...new Set(notes.map(n => n.category))];
      const stats = {
        notes_count: notes.length,
        favorite_notes_count: notes.filter(n => n.is_favorite).length,
        categories,
        recent_activities_count: activities?.length || 0,
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Get user stats error:', error);
      return { data: null, error: 'Failed to get user statistics' };
    }
  }
}