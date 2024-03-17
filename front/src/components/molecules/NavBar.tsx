import { NavLink } from 'react-router-dom';

function NavBar() {
  return (
    <header className="container flex flex-wrap items-center justify-between mx-auto w-full">
      <NavLink to="/" className="block" aria-label='Search books'>
        <h1 className="text-4xl font-bold text-center py-8 font-serif">
          Books
        </h1>
      </NavLink>
      <nav className="flex">
        <NavLink
          to='/'
          className="block text-xl rounded-xl border py-2 px-4 mx-2 bg-orange-50 border-orange-100 hover:bg-orange-100 hover:border-orange-200"
          aria-label='Search books'
        >
          Search
        </NavLink>
        <NavLink
          to='/bookings'
          className="block text-xl rounded-xl border py-2 px-4 mx-2 bg-orange-50 border-orange-100 hover:bg-orange-100 hover:border-orange-200"
          aria-label='List my bookings'
        >
          My Bookings
        </NavLink>
      </nav>
    </header>
  );
}

export default NavBar;
