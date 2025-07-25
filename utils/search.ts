import { SearchFilter, SearchResult } from "~/types";

// Filter search results by type
export const filterSearchResults = (
  results: SearchResult[],
  activeFilter: SearchFilter
): SearchResult[] => {
  if (activeFilter === "All") {
    return results;
  }

  // Remove 's' from filter to match singular type
  const filterType = activeFilter.slice(0, -1) as SearchResult["type"];
  return results.filter((item) => item.type === filterType);
};

// Get user avatar initial from email
export const getAvatarInitial = (email?: string): string => {
  if (!email) return "U";
  return email.charAt(0).toUpperCase();
};

// Clear search query utility
export const clearSearchQuery = (setSearchQuery: (query: string) => void) => {
  setSearchQuery("");
};
