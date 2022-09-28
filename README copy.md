# OLAMIDE

Hello there, I hope you are doing welll,  In this post I'll share with you how to implement a very scalable role based authorization.

So we will be doing this in five easy steps

## 1. Installing the required libraries
This post is based on nextjs and typescript so you will need to install nextjs, but we will use a starter template. Copy the following to your terminal.
```terminal
npx create-next-app@latest --typescript
```
Or
```terminal
yarn create next-app --typescript
```

After a couple of minutes the installation should be done.

## 2. Adding the needed types
Create a <code>types</code> folder in the root directory and add a file named <code>index.ts</code> in it.
Edit the content of the file to contain this;

```typescript
// types/index.tsx
export type Blog = { slug: string; title: string;description: string };

export type BlogBody = Pick<Blog, 'title' | 'description'>;

export type Roles = 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';
```
The `Blog` type specifies the types of the blog, while the `BlogBody` type specifies the type without a unique slug. The `Roles` type specifies the roles we will be using for our project, feel free to add other roles that might be required for yout project.

## 3. Addding the required components
Create a `components` folder in the root directory then  we are going to be adding the following files, namely `AuthGuard.tsx`, `NavBar.tsx`, `Roles.tsx` and `BlogForm.tsx`.

### Starting with the AuthGuard components create a `AuthGuard.tsx` file in the components folder and add the following;
```typescript
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
```
This will be an Higher Order Component (HOC) that will wrap all of our other components. In this file we will import the `checkIfUserIsAllowed` function and then check if the current pathname is required on intial load and everytime the pathname is changed. It also contains the `NavBar` and the `Roles` Component which we want to be available on all views.

### The next step is to create a `NavBar.tsx` file in the  component folder and place the following code in it;
```typescript
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
```

This component will be available on all pages and displays the links according to the paths accessible by the user. The function `checkIfUserIsAllowed` is imported from our global context and is used to conditionally render each of the links. PS. You might have an array of links in your project, so you can just check the accessiblity on every loop.

### The next file to be created is the `Roles.tsx` file in the components directory which will contain our simple roles control. Replace the content with the following;
```typescript
import { useContext } from 'react';
import { GlobalContext } from '../context';

const Roles = () => {
  const { updateRoles } = useContext(GlobalContext);

  const setRoles = (e: any) => {
    const formElement: HTMLFormElement | null = document.querySelector('form');
    const formData = new FormData(formElement || undefined);
    const editor = formData.get('editor')?.toString() || '';
    const admin = formData.get('admin')?.toString() || '';
    const super_admin = formData.get('super_admin')?.toString() || '';

    const roles: string[] = [editor, admin, super_admin].filter((i) => i) || [];

    updateRoles(roles);
  };

  return (
    <div className="roles-container">
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <input onChange={setRoles} name="editor" value="EDITOR" type="checkbox" />
          <label>EDITOR</label>
          <input onChange={setRoles} name="admin" value="ADMIN" type="checkbox" />
          <label>ADMIN</label>
          <input onChange={setRoles} name="super_admin" value="SUPER_ADMIN" type="checkbox" />
          <label>SUPERADMIN</label>
        </div>
      </form>
    </div>
  );
};

export default Roles;
```
As you can see we have three different roles with different accessiblities. When any of the roles with the checkbox are checked or unchecked the app global state is updated by the `updateRoles` function imported from the global context provider.

### The last file to be placed in the components folder is the `BlogForm.tsx` file which will contain the form to create and update our blogs, and it uses and `editMode` props to check if the user is on the edit page or the create page. Add the following to the file;
```typescript
import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { GlobalContext } from '../context';
import { Blog, BlogBody } from '../types';

const BlogForm = ({ editMode }: { editMode?: boolean }) => {
  const { push, query } = useRouter();
  const { addBlog, editBlog, blogs } = useContext(GlobalContext);
  const [blogData, setBlogData] = useState<BlogBody>({ title: '', description: '' });

  useEffect(() => {
    if (editMode) {
      const blogData = blogs.find((el) => el.slug === query.blog);
      if (!blogData) {
        alert('blog not found');
      } else setBlogData(blogData);
    }
  }, [editMode]);

  const titleChangeHandler = (e: any) => {
    setBlogData((oldValue: BlogBody) => {
      return { ...oldValue, title: e.target.value };
    });
  };

  const descriptionChangeHandler = (e: any) => {
    setBlogData((oldValue: BlogBody) => {
      return { ...oldValue, description: e.target.value };
    });
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (!blogData?.title || !blogData?.description)
      return alert('Title and Description are required');

    editMode ? editBlog(blogData, query.blog?.toString() || '') : addBlog(blogData);
    push('/');
  };

  const titleText = editMode ? 'Edit' : 'Create';

  return (
    <div>
      <h2>{titleText} Blog</h2>
      <form onSubmit={onSubmit}>
        <input
          onChange={titleChangeHandler}
          value={blogData?.title}
          placeholder="Enter blog title here.."
          className="text-input"
          type="text"
        />
        <br />
        <textarea
          onChange={descriptionChangeHandler}
          value={blogData?.description}
          placeholder="Enter blog content here.."
          rows={3}
          className="text-input"
        />
        <br />
        <button className="button">{titleText}</button>
      </form>
    </div>
  );
};

export default BlogForm;
```

This file updates the blogs in the app state using the imported `addBlog` and `updateBlog` methods from the app global context.

## 3. Creating the application pages
Locate the folder named `pages` in the root of your application for this section.

An `index.tsx` file will be present in the folder, replace the content with the following
```typescript
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context';
import { Blog } from '../types';

const Home: NextPage = () => {
  const { blogs } = useContext(GlobalContext);

  const [pageData, setPageData] = useState<Blog[]>([]);

  useEffect(() => {
    setPageData(() => blogs.reverse());
  }, [blogs]);

  return (
    <div className="blogs-container">
      <Head>
        <title>Blogs</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2>All Blogs</h2>
      <div>
        {pageData.map((blog, index) => (
          <Link href={`/edit/${blog.slug}`} key={blog.slug}>
            <div className="blog-container">
              <div>
                <b>{blog.title}</b>
              </div>
              <div>{blog.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
```
It fetches the blogs from the app global state and displays it in 

Then create a file named `create.tsx` in the pages directory, which will show the blog form in create mode. Add the following;
```typescript
import BlogForm from '../components/BlogForm';

const CreateBlog = () => {
  return <BlogForm />;
};

export default CreateBlog;
```

We also need a page to edit our blogs so create a folder named `edit` and create a dynamic page named `[blog].tsx` inside the folder and the following;
```typescript
import BlogForm from '../../components/BlogForm';

const EditBlog = () => {
  return <BlogForm editMode />;
};

export default EditBlog;
```

### Locate the `_app.tsx` file in the pages folder and replcae it with this;
```typescript
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { GlobalContextProvider } from '../context';
import AuthGuard from '../components/AuthGuard';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GlobalContextProvider>
      <AuthGuard>
        <Component {...pageProps} />
      </AuthGuard>
    </GlobalContextProvider>
  );
}

export default MyApp;
```

### Lastly for our pages we will add some basic styling. 
Locate the `styles` folder which already exists in your application's root directory, and then replace the content of the `globals.css` directory with this;
```css
html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  /* color: inherit; */
  /* text-decoration: none; */
}

* {
  box-sizing: border-box;
}

.nav-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.nav-container div {
  margin: 0 7px;
}

.roles-container {
  text-align:center;
  margin-bottom: 20px;
}

.container {
  padding: 20px;
  text-align:center;
}

.blogs-container div {
  display:flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.blog-container {
  text-align:left;
  padding: 6px;
  background-color: gray;
  color: white;
  border-radius: 7px;
  margin: 10px 0px;
  max-width: 700px;
  width: 100%;
}

.blog-container p {
  margin:3px;
}

.text-input {
  min-width: 350px;
  min-height: 30px;
  padding: 4px;
  margin: 4px 0;
}

.button {
  width: 350px;
  height: 30px;
  background-color: blue;
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
}
```

## 4. Add the logic to check page and function accessiblities in a global context
### Create a `context` folder at the root of your project 
Create a file called `roles.ts` and add the following configuration;
```typescript
import { Roles } from '../types';

const pathRoles: { [key: string]: [Roles] } = {
  'edit-[blog]': ['ADMIN'],
  create: ['EDITOR']
};

export default pathRoles;
```

Then create a file in the directory named `index.tsx`.  
Add the following content to the file;
```typescript
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
```

This is the most important file in this article and it contains the function that checks users accessiblity based on a pathname.  
Skipping all other configurations and methods in our global context, lets focus on the `checkIfUserIsAllowed` function.

### The checkIfUserIsAllowed function
The basic working of the function is listed below;
1. It takes in a pathName and splits it for every `/` e.g `/edit/[blog]` gets splitted to an array of `['edit', '[blog]']`.
2. It then imports a configuration file which contains the configuration of the paths and the roles as explained before.
3. The splitted paths from the pathName is looped recursively until a configuration key in the pathRoles object is found. I know you might be a bit lost but this is how it works.
4. Given a configuration for `edit-[blog]`, On the inital loop it joins all the content of the splitted path with a `-` so using our example in the first step, the result would be `edit-[blog]`. If a configuration of `edit-[blog]: ['ADMIN']` is provided in the pathRoles configuration it picks this value as the required roles and stops the loop. If a configuration for `edit-[blog]` is not found it removes the last path from the splitted paths array and performs another check to see if the next joint path was specified for in this case we are left with `edit` so if a configuration was specified for the `edit` path it will stop the loop and continue. It continues like this till there is no splitted path available.
5. The previous loop sets a `requiredRoles` array which is checked by an if statement to determine if the user is authorized. It also gives the `SUPER_ADMIN` role an exception for all routes.
6. It returns true or false descriptionChangeHandlernding on the required roles, if no roles are required, then it return true to allow all users.

This as been a long one, i hope the concept is clear. This methods is very scalable to deeply nested route.

If this method was useful for your project, drop a comment in the comments section, i would like to know how you implemented the function in your application.