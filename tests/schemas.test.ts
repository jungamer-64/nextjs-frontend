import { describe, it, expect } from 'vitest';
import { PostListResponseSchema, PostSchema, CategorySchema, MediaSchema } from '../src/lib/schemas';

describe('zod schemas', () => {
  it('coerces numeric ids to strings and normalizes name/alt', () => {
    const raw = {
      docs: [
        {
          id: 123,
          title: 'Hello',
          slug: 'hello',
          summary: null,
          publishedAt: '2025-01-01',
          heroImage: { url: '/img.png', width: 800, height: 600, alt: null },
          categories: [{ id: 1, name: undefined, slug: 'cat' }],
          content: { root: { children: [] } },
        },
      ],
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: null,
      prevPage: null,
      totalDocs: 1,
      totalPages: 1,
      page: 1,
      limit: 10,
    };

    const parsed = PostListResponseSchema.parse(raw);
    expect(parsed.docs[0].id).toBe('123');
    expect(parsed.docs[0].heroImage?.alt).toBe('');
    expect(parsed.docs[0].categories?.[0].name).toBe('');
  });

  it('media schema transforms null alt to empty string', () => {
    const raw = { url: '/x.png', alt: null };
    const parsed = MediaSchema.parse(raw);
    expect(parsed.alt).toBe('');
  });

  it('category schema normalizes missing name', () => {
    const raw = { id: 42, slug: 'x' };
    const parsed = CategorySchema.parse(raw);
    expect(parsed.name).toBe('');
    expect(parsed.id).toBe('42');
  });
});
