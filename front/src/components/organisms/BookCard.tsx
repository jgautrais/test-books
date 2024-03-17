import { NavLink } from 'react-router-dom';
import {Book} from "../../types/books.ts";

type Props = {
  book: Book;
};

function NavBar({ book }: Props) {
  const formatter = new Intl.DateTimeFormat('en', { month: 'short', year:'numeric' });

  return (
    <NavLink
      to={`/book/${book.id}`}
      aria-label={`Browse details for the book ${book.title}`}
      className='rounded-2xl bg-gray-50 px-4 py-3 hover:shadow-orange-100 shadow-md hover:shadow-lg border border-transparent hover:border-orange-200'>
      <div className="flex items-start justify-between">
        <p className="text-2xl text-start font-bold">{book.title}</p>
        <p className="mt-2 text-xs border-orange-200 bg-orange-100 rounded-xl px-2 py-1">{book.category}</p>
      </div>
      <p className="text-lg text-start">{book.author}</p>
      <p className="text-xs text-start">{formatter.format(new Date(book.publishedAt))}</p>
    </NavLink>
  );
}

export default NavBar;