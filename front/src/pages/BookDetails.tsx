import { PageTemplate } from '../components/template';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchBookById } from '../services/books';
import { LoadingSpinner } from "../components/atoms";
import {NavLink, useParams} from "react-router-dom";
import {BookingPayload} from "../types/bookings.ts";
import {createBooking} from "../services/bookings.ts";

function BookDetails() {
  const { id } = useParams();
  const formatter = new Intl.DateTimeFormat('en', { month: 'short', year:'numeric' });

  const getDateFormatted = (endDate = false): string => {
    const date = new Date();
    if (endDate) {
      date.setDate(date.getDate() + 7);
    }
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);

    return `${year}-${month}-${day}`;
  };

  const { data: book, isLoading, error } = useQuery({
    queryKey: ['book', id],
    queryFn: () => fetchBookById(typeof id === 'string' ? parseInt(id) : id),
    enabled: !!id,
    select: (result) => result?.data[0]
  });

  const { mutate, isPending, error: bookingError, isSuccess } = useMutation<
    { id: number },
    string,
    BookingPayload
  >({
    mutationKey: ['register'],
    mutationFn: createBooking,
  });

  const onSubmit = () => {
    if (book) {
      mutate({
        userId: 1,
        bookId: book.id,
        startDate: getDateFormatted(),
        endDate: getDateFormatted(true)
      });
    }
  };

  return (
    <PageTemplate>
      <>
        { isLoading || !book ? <LoadingSpinner /> : (
          <div className='text-start'>
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">{book.title}</h2>
              <p className="ms-3 mt-1 text-xs border-orange-200 bg-orange-100 rounded-xl px-2 py-1">{book.category}</p>
            </div>
            <p>Auteur: <span className="font-bold">{book.author}</span></p>
            <p className="text-xs">Publication: <span
              className="font-bold">{formatter.format(new Date(book.publishedAt))}</span></p>
            <p className="mt-2">Description: <span className="italic">{book.description}</span></p>
            <button
              onClick={onSubmit}
              className="block min-w-32 min-h-10 mt-5 border py-1 px-2 rounded bg-blue-50 text-blue-800 border-blue-400 hover:bg-blue-400 hover:text-white"
              aria-label="Loan book"
            >
              { isPending ? <LoadingSpinner /> : 'Loan book'}
            </button>
            {
              bookingError && <p className='text-red-600 mt-4'>{ bookingError }</p>
            }
            {
              isSuccess && <p className='text-green-600 mt-4'>Booking confirmed !</p>
            }
            <NavLink to='/'
                     className='inline-block mt-16 text-xl rounded-xl border py-2 px-4 bg-orange-50 border-orange-100 hover:bg-orange-100 hover:border-orange-200'>Back
              to books list</NavLink>
          </div>
        )}
        {
          error && <p className='text-red-600 mt-4'>Error fetching the book, please try again</p>
        }
      </>
    </PageTemplate>
  );
}

export default BookDetails;