import { SearchFilter, SearchResult } from "~/types";

export const searchFilters: SearchFilter[] = [
  "All",
  "Documents",
  "Images",
  "People",
  "Projects",
];

export const searchResults: SearchResult[] = [
  {
    id: 1,
    title: "Project Alpha Documentation",
    type: "Document",
    date: "2 days ago",
    icon: "file-text",
  },
  {
    id: 2,
    title: "Team Meeting Notes",
    type: "Document",
    date: "1 week ago",
    icon: "file-text",
  },
  {
    id: 3,
    title: "Design Assets",
    type: "Image",
    date: "3 days ago",
    icon: "image",
  },
  {
    id: 4,
    title: "John Smith",
    type: "Person",
    date: "Active now",
    icon: "user",
  },
  {
    id: 5,
    title: "Mobile App Project",
    type: "Project",
    date: "5 days ago",
    icon: "folder",
  },
];

export const quickSearchSuggestions: string[] = [
  "Recent documents",
  "My projects",
  "Team files",
  "Shared items",
];

export const recentSearches: string[] = [
  "project alpha",
  "team meeting",
  "design files",
  "project beta",
  "project gamma",
  "project delta",
  "project epsilon",
  "project zeta",
  "project eta",
  "project theta",
  "project iota",
  "project kappa",
  "project lambda",
  "project mu",
  "project nu",
  "project xi",
  "project omicron",
  "project pi",
  "project rho",
  "project sigma",
  "project tau",
  "project upsilon",
  "project phi",
  "project chi",
  "project psi",
  "project omega",
];
