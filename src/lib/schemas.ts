import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.coerce.string(),
  // name can occasionally be missing from the CMS, allow optional
  name: z.string().optional(),
  slug: z.string(),
}).transform((obj) => ({
  // Normalize missing name to empty string so UI doesn't need to guard everywhere
  ...obj,
  name: obj.name ?? '',
}));

export const MediaSchema = z.object({
  url: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  // some entries return `null` for alt — coerce to empty string for easier use in UI
  alt: z.string().nullable().optional().transform((v) => v ?? ''),
});

export const RTNodeSchema: z.ZodTypeAny = z.lazy(() =>
  z.object({
    type: z.string().optional(),
    tag: z.string().optional(),
    children: z.array(RTNodeSchema).optional(),
    text: z.string().optional(),
    fields: z.object({ url: z.string().optional() }).optional(),
    format: z.number().optional(),
    ordered: z.boolean().optional(),
  })
);

export const RTContentSchema = z.object({
  root: z.object({
    children: z.array(RTNodeSchema).optional(),
  }).optional(),
});

export const PostSchema = z.object({
  // IDs may be numbers in the raw payload; coerce to string
  id: z.coerce.string(),
  title: z.string(),
  slug: z.string().optional(),
  // summary may be null in some payloads — normalize to empty string
  summary: z.string().nullable().optional().transform((v) => v ?? ''),
  publishedAt: z.string(),
  heroImage: MediaSchema.optional(),
  categories: z.array(CategorySchema).optional(),
  content: RTContentSchema.optional(),
});

export const ApiResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    docs: z.array(itemSchema),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
    nextPage: z.number().nullable(),
    prevPage: z.number().nullable(),
    totalDocs: z.number(),
    totalPages: z.number(),
    page: z.number(),
    limit: z.number(),
  });

export const PostListResponseSchema = ApiResponseSchema(PostSchema);
export const CategoryListResponseSchema = ApiResponseSchema(CategorySchema);
