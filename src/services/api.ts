export const WP_API_URL = 'https://achartemas.com/wp-json/wp/v2';

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
  const response = await fetch(`${WP_API_URL}/categories?per_page=100`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
}

export async function fetchPosts(categoryIds?: number[], searchQuery?: string): Promise<Post[]> {
  let url = `${WP_API_URL}/posts?_embed&per_page=12`;
  if (categoryIds && categoryIds.length > 0) {
    url += `&categories=${categoryIds.join(',')}`;
  }
  if (searchQuery) {
    url += `&search=${encodeURIComponent(searchQuery)}`;
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch posts');
  return response.json();
}

export async function searchAllPosts(): Promise<Post[]> {
  const response = await fetch(`${WP_API_URL}/posts?_embed&per_page=100`);
  if (!response.ok) throw new Error('Failed to fetch posts for search');
  return response.json();
}

export async function fetchPost(id: number): Promise<Post> {
  const response = await fetch(`${WP_API_URL}/posts/${id}?_embed`);
  if (!response.ok) throw new Error('Failed to fetch post');
  return response.json();
}

export async function fetchComments(postId: number): Promise<WPComment[]> {
  const response = await fetch(`${WP_API_URL}/comments?post=${postId}&per_page=100`);
  if (!response.ok) throw new Error('Failed to fetch comments');
  return response.json();
}
