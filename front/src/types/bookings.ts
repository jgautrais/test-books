import { z } from 'zod';

export const BookingSchema = z.object({
  id: z.number(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  status: z.string().min(1),
  bookId: z.number(),
  bookTitle: z.string().min(1)
});
export type Booking = z.infer<typeof BookingSchema>;

export const BookingsCollectionApiSchema = z.object({
  data: z.array(BookingSchema)
})
export type BookingsCollectionApi = z.infer<typeof BookingsCollectionApiSchema>;

export const BookingPayloadSchema = z.object({
  userId: z.number(),
  bookId: z.number(),
  startDate: z.string().min(1),
  endDate: z.string().min(1)
})
export type BookingPayload = z.infer<typeof BookingPayloadSchema>;