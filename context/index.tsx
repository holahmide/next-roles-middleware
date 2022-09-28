import { createContext, ReactNode, useCallback, useMemo, useState } from 'react';
import type { Blog, BlogBody, GlobalContextProps, Roles } from '../types';
import pathRoles from './roles';

export const GlobalContext = createContext<GlobalContextProps>({
  roles: [],
  blogs: [],
  updateRoles: () => null,
  addBlog: () => null,
  editBlog: () => null,
  checkIfUserIsAllowed: () => true
});

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  let userRoles: Roles[] = [];
  let userBlogs: Blog[] = [];
  if (typeof window !== 'undefined') {
    userRoles = JSON.parse(localStorage.getItem('roles') || '[]');
    userBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
  }

  const updateRoles = (roles: Roles[]) => {
    localStorage.setItem('roles', JSON.stringify(roles));
    setRoles(roles);
  };

  const addBlog = (blog: BlogBody) => {
    blogs.push({ ...blog, slug: generateSlug(blog, blogs) });
    localStorage.setItem('blogs', JSON.stringify(blogs));
    setBlogs(blogs);
  };

  const editBlog = (blog: BlogBody, slug: string) => {
    const findBlogIndex = blogs.findIndex((el) => el.slug === slug);
    blogs[findBlogIndex] = { ...blog, slug: generateSlug(blog, blogs) };
    localStorage.setItem('blogs', JSON.stringify(blogs));
    setBlogs(blogs);
  };

  const [roles, setRoles] = useState<Roles[]>(userRoles);
  const [blogs, setBlogs] = useState<Blog[]>(userBlogs);

  const checkIfUserIsAllowed = useCallback(
    (pathname: string, userRoles: Roles[] = roles) => {
      const paths = pathname.split('/').filter((i: any) => i); // Split Current path name
      const pathRolesKeys = Object.keys(pathRoles); // get the paths that permission was set for
      let requiredRoles: Roles[] = []; // initializes path required roles
      let allowed: boolean = true; // makes the function return a default of true

      // join the paths with '-' and check if a path was set for it
      // It checks recursively for all the path from the last till it finds one that is set
      while (paths.length > 0 && requiredRoles.length === 0) {
        const key: any = paths.join('-');
        if (pathRolesKeys.includes(key)) requiredRoles = pathRoles[key];
        else paths.pop();
      }

      //  check if user has all the permissions
      if (userRoles.includes('SUPER_ADMIN')) return true;
      if (
        requiredRoles.length > 0 &&
        !requiredRoles.every((item: Roles) => userRoles.includes(item))
      )
        allowed = false;

      return allowed;
    },
    [roles]
  );

  return (
    <GlobalContext.Provider
      value={{ roles, updateRoles, blogs, addBlog, editBlog, checkIfUserIsAllowed }}>
      {children}
    </GlobalContext.Provider>
  );
};

const generateSlug = (blog: BlogBody, blogs: Blog[]) => {
  let unique = false;
  let slug = '';
  let count = 0;
  while (!unique) {
    slug = !count ? blog.title.split(' ').join('-') : `${blog.title.split(' ').join('-')}-${count}`;
    if (!blogs.find((el: Blog) => el.slug === slug)) unique = true;
    count += 1;
  }
  return slug;
};
