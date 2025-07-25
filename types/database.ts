// Database types for Supabase CRUD operations

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface CreateNoteData {
  title: string;
  content: string;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
}

// Database response types
export interface DatabaseResponse<T> {
  data: T | null;
  error: string | null;
}

export interface DatabaseListResponse<T> {
  data: T[];
  error: string | null;
}

// Filter and pagination types
export interface NoteFilters {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}