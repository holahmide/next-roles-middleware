import { useRouter } from 'next/router';
import { ReactNode, useContext, useEffect } from 'react';
import { GlobalContext } from '../context';
import NavBar from './NavBar';
import Roles from './Roles';

const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { checkIfUserIsAllowed } = useContext(GlobalContext);
  const { pathname, push } = useRouter();

  useEffect(() => {
    if (!checkIfUserIsAllowed(pathname)) {
      alert('Page is restricted!');
      push('/');
    }
  }, [pathname]);

  return (
    <div className="container">
      <NavBar />
      <Roles />
      {children}
    </div>
  );
};

export default AuthGuard;
