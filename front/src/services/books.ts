import { instance } from './instance';
import { BookApi, BooksCollectionApi} from '../types/books';

type Filters = {
  title?: string|undefined,
  genre?: string|undefined,
  publicationYear?: string|undefined
}

export const fetchBooks = async (filters: Filters|{}) =>
  instance
    .get('books',
      {
        searchParams: filters
      })
    .json<BooksCollectionApi|undefined>();

export const fetchBookById = async (id: number|undefined) =>
  instance.get(`books/${id}`).json<BookApi|undefined>();
