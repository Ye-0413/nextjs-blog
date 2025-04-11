import { allTalks as contentTalks } from "content-collections";

export interface Talk {
  slug: string;
  title: string;
  date: string;
  event: string;
  location?: string;
  featured?: boolean;
  summary: string;
  coverImage?: string;
  videoUrl?: string;
  slidesUrl?: string;
  keywords?: string[];
  content: string;
}

export const allTalks: Talk[] = contentTalks;

export default allTalks; 