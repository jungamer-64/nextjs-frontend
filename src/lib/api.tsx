// src/lib/api.ts

import { API_URL } from '@/constants';
import type { ApiResponse, Post, Category } from '@/types';
import { PostListResponseSchema, CategoryListResponseSchema } from './schemas';
import { z } from 'zod';

type FetchPostsParams = {
  limit?: number;
  page?: number;
  categoryId?: string;
};

export const fetchPosts = async (
  params: FetchPostsParams = {}
): Promise<ApiResponse<Post>> => {
  const { limit, page, categoryId } = params;
  const query = new URLSearchParams();

  if (limit) query.set('limit', String(limit));
  if (page) query.set('page', String(page));
  if (categoryId) query.set('where[categories][in]', categoryId);
  query.set('depth', '1');

  const url = `${API_URL}/api/pages?${query.toString()}`;

  try {
    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

  const raw = await response.json();
  const parsed = PostListResponseSchema.parse(raw);
  return parsed as ApiResponse<Post>;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return {
      docs: [],
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: null,
      prevPage: null,
      totalDocs: 0,
      totalPages: 0,
      page: 1,
      limit: 0,
    };
  }
};

export const fetchCategoryBySlug = async (slug: string): Promise<ApiResponse<Category>> => {
  const url = `${API_URL}/api/categories?where[slug][equals]=${encodeURIComponent(slug)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch category: ${response.statusText}`);
  const raw = await response.json();
  try {
  const parsed = CategoryListResponseSchema.parse(raw);
  return parsed as ApiResponse<Category>;
  } catch (e) {
    if (e instanceof z.ZodError) {
      throw new Error(`Category response validation failed: ${e.message}`);
    }
    throw e;
  }
};

export const fetchPagesByCategory = async (categoryId: string) => {
  const url = `${API_URL}/api/pages?where[categories][in]=${encodeURIComponent(categoryId)}&depth=1`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to fetch pages for category: ${response.statusText}`);
  const raw = await response.json();
  const parsed = PostListResponseSchema.parse(raw);
  return parsed as ApiResponse<Post>;
};

export const fetchPageBySlug = async (slug: string) => {
  const url = `${API_URL}/api/pages?where[slug][equals]=${encodeURIComponent(slug)}&depth=1`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to fetch page by slug: ${response.statusText}`);
  const raw = await response.json();
  const parsed = PostListResponseSchema.parse(raw);
  return parsed as ApiResponse<Post>;
};

// Safe wrappers that return data or error instead of throwing.
export type SafeResult<T> = { data?: T; error?: string };

export const fetchPageBySlugSafe = async (slug: string): Promise<SafeResult<ApiResponse<Post>>> => {
  try {
    const data = await fetchPageBySlug(slug);
    return { data };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { error: message };
  }
};

export const fetchPagesByCategorySafe = async (categoryId: string): Promise<SafeResult<ApiResponse<Post>>> => {
  try {
    const data = await fetchPagesByCategory(categoryId);
    return { data };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { error: message };
  }
};

export const fetchCategoryBySlugSafe = async (slug: string): Promise<SafeResult<ApiResponse<Category>>> => {
  try {
    const data = await fetchCategoryBySlug(slug);
    return { data };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { error: message };
  }
};