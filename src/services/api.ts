import postsData from '../data/posts.json';
import categoriesData from '../data/categories.json';
import commentsData from '../data/comments.json';

export const WP_API_URL = ''; // No longer used for fetching

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface Post {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
  categories: number[];
}

export interface WPComment {
  id: number;
  author_name: string;
  date: string;
  content: { rendered: string };
  author_avatar_urls?: { [key: string]: string };
  post: number;
}

export async function fetchCategories(): Promise<Category[]> {
  return categoriesData as Category[];
}

export async function fetchPosts(categoryIds?: number[], searchQuery?: string): Promise<Post[]> {
  let filtered = postsData as Post[];

  if (categoryIds && categoryIds.length > 0) {
    filtered = filtered.filter(post => 
      post.categories.some(catId => categoryIds.includes(catId))
    );
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(post => 
      post.title.rendered.toLowerCase().includes(q) || 
      post.content.rendered.toLowerCase().includes(q)
    );
  }

  return filtered;
}

export async function searchAllPosts(): Promise<Post[]> {
  return postsData as Post[];
}

export async function fetchPost(id: number): Promise<Post> {
  const post = (postsData as Post[]).find(p => p.id === id);
  if (!post) throw new Error('Post not found');
  return post;
}

export async function fetchLocalComments(postId: number): Promise<WPComment[]> {
  return (commentsData as WPComment[]).filter(c => c.post === postId);
}
