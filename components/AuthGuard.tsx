import { ReactNode } from 'react';
import NavBar from './NavBar';
import Roles from './Roles';

const AuthGuard = ({ children }: { children: ReactNode }) => {
  return (
    <div className="container">
      <NavBar />
      <Roles />
      {children}
    </div>
  );
};

export default AuthGuard;
