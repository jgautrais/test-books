import { PageTemplate } from '../components/template';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {LoadingSpinner} from "../components/atoms";
import {cancelBooking, fetchBookings} from "../services/bookings.ts";
import {NavLink} from "react-router-dom";

function Bookings() {
  const userId = 1;
  const queryClient = useQueryClient()

  const formatter = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year:'numeric' });

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['bookings', userId],
    queryFn: () => fetchBookings(userId),
  });

  const { mutate, isPending, error: cancelError } = useMutation<
    null,
    string,
    number
  >({
    mutationKey: ['register'],
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bookings']
      })
    }
  });

  const onSubmit = (id: number) => {
    mutate(id);
  };

  return (
    <PageTemplate>
      <>
        <h2 className="text-3xl text-start my-5">My Bookings</h2>
        {
          isLoading || !bookings ? <LoadingSpinner className='mt-4'/> : (
          <table className="mt-10 w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
              <tr>
                <th className="px-6 py-3">Book</th>
                <th className="px-6 py-3">Period</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
            {bookings?.data.map(booking => (
              <tr key={booking.id} className="bg-white border-b">
                <td className="px-6 py-3">
                  <NavLink to={`/book/${booking.bookId}`} className="text-blue-500 hover:underline" aria-label={`Browse book details for the booking: ${booking.bookTitle}`}>
                    {booking.bookTitle}
                  </NavLink>
                </td>
                <td className="px-6 py-3">{formatter.format(new Date(booking.startDate))} - {formatter.format(new Date(booking.endDate))}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => onSubmit(booking.id)}
                    className="block min-w-32 min-h-10 border py-1 px-2 rounded bg-red-50 text-red-800 border-red-400 hover:bg-red-400 hover:text-white"
                    aria-label="Cancel booking"
                  >
                    { isPending ? <LoadingSpinner /> : 'Cancel booking'}
                  </button>
                  {
                    cancelError && <p className='text-red-600 mt-4'>{ cancelError }</p>
                  }
                </td>
              </tr>
            ))}
            </tbody>
          </table>)
        }
        {
          error && <p className='text-red-600 mt-4'>Error fetching the books, please try again</p>
        }
      </>
    </PageTemplate>
  );
}

export default Bookings;