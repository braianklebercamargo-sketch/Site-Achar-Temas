import categoriesData from '../data/categories.json';
import postsData from '../data/posts.json';
import commentsData from '../data/comments.json';

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
  yoast_head_json?: {
    og_image?: Array<{
      url: string;
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
  let filteredPosts = postsData as Post[];

  if (categoryIds && categoryIds.length > 0) {
    filteredPosts = filteredPosts.filter(post => 
      post.categories.some(catId => categoryIds.includes(catId))
    );
  }

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.rendered.toLowerCase().includes(query) ||
      post.content.rendered.toLowerCase().includes(query) ||
      post.excerpt.rendered.toLowerCase().includes(query)
    );
  }

  // Mimic API behavior of returning a certain number of results
  return filteredPosts.slice(0, 12);
}

export async function searchAllPosts(): Promise<Post[]> {
  return postsData as Post[];
}

export async function fetchPost(id: number): Promise<Post> {
  const post = (postsData as Post[]).find(p => p.id === id);
  if (!post) throw new Error('Post not found');
  return post;
}

export async function fetchComments(postId: number): Promise<WPComment[]> {
  return (commentsData as WPComment[]).filter(c => c.post === postId);
}
