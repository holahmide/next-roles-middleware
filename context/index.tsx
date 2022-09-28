import { createContext, ReactNode, useCallback, useMemo, useState } from 'react';
import { Blog, BlogBody } from '../types';
import pathRoles from './roles';

type GlobalContext = {
  roles: string[];
  blogs: Blog[];
  updateRoles: (roles: string[]) => void;
  addBlog: (blogs: BlogBody) => void;
  editBlog: (blogs: BlogBody, slug: string) => void;
  checkIfUserIsAllowed: (pathName: string) => boolean;
};

export const GlobalContext = createContext<GlobalContext>({
  roles: [],
  blogs: [],
  updateRoles: () => null,
  addBlog: () => null,
  editBlog: () => null,
  checkIfUserIsAllowed: () => true
});

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  let userRoles: string[] = [];
  let userBlogs: Blog[] = [];
  if (typeof window !== 'undefined') {
    userRoles = JSON.parse(localStorage.getItem('roles') || '[]');
    userBlogs = JSON.parse(localStorage.getItem('blogs') || '[]');
  }

  const updateRoles = (roles: string[]) => {
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

  const [roles, setRoles] = useState<string[]>(userRoles);
  const [blogs, setBlogs] = useState<Blog[]>(userBlogs);

  const checkIfUserIsAllowed = useCallback(
    (pathName: string) => {
      // Split Current path name
      const paths = pathName.split('/').filter((i: any) => i);
      // get the paths that permission was set for
      const pathRolesKeys = Object.keys(pathRoles);

      let requiredRoles: string[] = [];
      let allowed: boolean = true;

      // join the paths with '-' and check if a path was set for it
      // It checks recursively for all the path from the last till it finds one that is set
      while (paths.length > 0 && requiredRoles.length === 0) {
        const key: any = paths.join('-');
        if (pathRolesKeys.includes(key)) requiredRoles = pathRoles[key];
        else paths.pop();
      }

      // check if user has all the permissions
      if (roles.includes('SUPER_ADMIN')) return true;
      if (
        requiredRoles.length > 0 &&
        !requiredRoles.every((item: string) => roles.includes(item))
      ) {
        allowed = false;
      }

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
