import { z } from 'zod';

export const BookSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  description: z.string().min(1),
  author: z.string().min(1),
  publishedAt: z.string(),
  category: z.string().min(1)
});
export type Book = z.infer<typeof BookSchema>;

export const BookApiSchema = z.object({
  data: z.array(BookSchema)
});
export type BookApi = z.infer<typeof BookApiSchema>;

export const BooksCollectionApiSchema = z.object({
  data: z.array(BookSchema)
})
export type BooksCollectionApi = z.infer<typeof BooksCollectionApiSchema>;