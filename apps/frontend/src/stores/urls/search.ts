import { BaseUrls } from './base';

const SEARCH = BaseUrls.SEARCH_BASE_URL;
const SUGGESTIONS = `${BaseUrls.SEARCH_BASE_URL}/suggestions`;

export const SearchUrls = {
  SEARCH,
  SUGGESTIONS,
} as const;
