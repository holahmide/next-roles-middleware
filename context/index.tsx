import { createContext, ReactNode, useMemo, useState } from 'react';
import { Blog, BlogBody } from '../types';

type GlobalContext = {
  roles: string[];
  blogs: Blog[];
  updateRoles: (roles: string[]) => void;
  addBlog: (blogs: BlogBody) => void;
  editBlog: (blogs: BlogBody, slug: string) => void;
};

export const GlobalContext = createContext<GlobalContext>({
  roles: [],
  blogs: [],
  updateRoles: () => null,
  addBlog: () => null,
  editBlog: () => null
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

  return (
    <GlobalContext.Provider value={{ roles, updateRoles, blogs, addBlog, editBlog }}>
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
