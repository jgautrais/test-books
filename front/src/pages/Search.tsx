import {useEffect, useState} from "react";
import { PageTemplate } from '../components/template';
import { useQuery } from '@tanstack/react-query';
import { fetchBooks } from '../services/books';
import {LoadingSpinner} from "../components/atoms";
import {BookCard} from "../components/organisms";
import useDebounce from "../components/hooks/useDebounce.ts";


function Search() {
  const [filters, setFilters] = useState<Record<string, string|number|boolean|undefined>>({})
  const debouncedFilters = useDebounce(filters)

  const { data: books, isLoading, error } = useQuery({
    queryKey: ['books', debouncedFilters],
    queryFn: () => fetchBooks(debouncedFilters),
  });

  const [yearsOptions, setYearsOptions] = useState<undefined|number[]>(undefined)
  const [categoryOptions, setCategoryOptions] = useState<undefined|string[]>(undefined)

  // Init filters options
  useEffect(() => {
    if (books && Object.keys(filters).length === 0) {
      setYearsOptions([...new Set(books.data.map(book => parseInt(book.publishedAt.slice(0, 4))))].sort())
      setCategoryOptions([...new Set(books.data.map(book => book.category))].sort((a, b) => a.localeCompare(b)))
    }
  }, [books]);

  const onChangeFilter  = (key: string, value: string|boolean|undefined) => {
    if (!value && key in filters) {
      delete filters[key]
      setFilters({
        ...filters
      })
    } else {
      setFilters({
        ...filters,
        [key]: value
      })
    }
  }

  return (
    <PageTemplate>
      <>
        <h2 className="text-3xl text-start my-5">Search books</h2>
        <div className='bg-gray-50 p-3 rounded'>
          <p className='font-bold my-3'>Filter books</p>
          <label className='px-5'>
            Title:
            <input
              type='text'
              onChange={e => onChangeFilter('title', e.target.value ?? undefined)}
              disabled={isLoading && !error}
            />
          </label>
          <label className='px-5'>
            Year:
            <select
              onChange={e => onChangeFilter('publicationYear', e.target.value === 'All' ? undefined : e.target.value)}
              disabled={isLoading && !error}
              className='border rounded'
            >
              <option value={undefined} key={'year_undefined'}>All</option>
              {yearsOptions?.map(year => (
                <option value={year} key={year}>{year}</option>
              ))}
            </select>
          </label>
          <label className='px-5'>
            Genre:
            <select
              onChange={e => onChangeFilter('genre', e.target.value === 'All' ? undefined : e.target.value)}
              disabled={isLoading && !error}
              className='border rounded'
            >
              <option value={undefined} key={'category_undefined'}>All</option>
              {categoryOptions?.map(category => (
                <option value={category} key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className='px-5'>
            Display available books only:
            <input
              type='checkbox'
              onChange={e => {
                console.log(e)
                onChangeFilter('isAvailable', e.target.checked ?? undefined)
              }}
              disabled={isLoading && !error}
            />
          </label>
        </div>
        {
          isLoading || !books ? <LoadingSpinner className='mt-4'/> : (
            <div className="mt-10 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {books?.data.map(book => (
                <BookCard book={book} key={book.id}/>
              ))}
            </div>)
        }
        {
          error && <p className='text-red-600 mt-4'>Error fetching the books, please try again</p>
        }
      </>
    </PageTemplate>
  );
}

export default Search;