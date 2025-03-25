
export interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: string;
  category?: string;
  tags?: string[];
  author?: string | null;
  date?: string;
  meta_description?: string;
  published: boolean;
  slug?: string;
}
