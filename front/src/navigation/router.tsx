import { createBrowserRouter } from 'react-router-dom';
import {Search, NotFound, BookDetails, Bookings} from '../pages';
import { MainRouter } from '../components/organisms';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainRouter />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Search />,
      },
      {
        path: '/book/:id',
        element: <BookDetails />,
      },
      {
        path: '/bookings',
        element: <Bookings />,
      },
    ],
  },
]);

export default router;