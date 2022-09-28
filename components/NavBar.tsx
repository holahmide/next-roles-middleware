import Link from 'next/link';

const NavBar = () => {
  return (
    <>
      <div className="nav-container">
        <div>
          <Link href="/">Blogs</Link>
        </div>
        <div>
          <Link href="/create">Create</Link>
        </div>
        <div>
          <Link href="/edit">Edit</Link>
        </div>
      </div>
      <hr />
    </>
  );
};

export default NavBar;
