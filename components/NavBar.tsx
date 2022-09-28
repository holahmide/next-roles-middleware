import Link from 'next/link';
import { useContext } from 'react';
import { GlobalContext } from '../context';

const NavBar = () => {
  const { checkIfUserIsAllowed } = useContext(GlobalContext);

  return (
    <>
      <div className="nav-container">
        {checkIfUserIsAllowed('/') && (
          <div>
            <Link href="/">Blogs</Link>
          </div>
        )}
        {checkIfUserIsAllowed('/create') && (
          <div>
            <Link href="/create">Create</Link>
          </div>
        )}
      </div>
      <hr />
    </>
  );
};

export default NavBar;
