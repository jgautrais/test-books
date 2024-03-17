import { instance } from './instance';
import {BookingPayload, BookingsCollectionApi} from "../types/bookings.ts";

export const fetchBookings = async (id: number) =>
  instance
    .get(`bookings/${id}`)
    .json<BookingsCollectionApi|undefined>();

export const createBooking = async (payload: BookingPayload) => {
  try {
    return await instance
      .post(`bookings`, {json: payload})
      .json<{ id: number }>();
  } catch (error: any) {
    const serverMessage = await error.response.text();
    return Promise.reject(serverMessage ? JSON.parse(serverMessage)?.errors : error);
  }
}

export const cancelBooking = async (id: number) => {
  try {
    return await instance
      .put(`bookings/cancel/${id}`)
      .json<null>();
  } catch (error: any) {
    const serverMessage = await error.response.text();
    return Promise.reject(serverMessage ? JSON.parse(serverMessage)?.errors : error);
  }
}