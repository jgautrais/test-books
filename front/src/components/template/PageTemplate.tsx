import { ReactNode } from 'react';
import { NavBar } from '../molecules';

type Props = {
  children: ReactNode;
};

function PageTemplate({ children }: Props) {
  return (
    <div className="container flex flex-col mx-auto text-center min-h-screen px-2">
      <NavBar />
      <main className="flex-grow">{children}</main>
    </div>
  );
}

export default PageTemplate;
