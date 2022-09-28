export type Blog = { slug: string; title: string; description: string };

export type BlogBody = Pick<Blog, 'title' | 'description'>;

export type Roles = 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';

export type GlobalContextProps = {
  roles: Roles[];
  blogs: Blog[];
  updateRoles: (roles: Roles[]) => void;
  addBlog: (blogs: BlogBody) => void;
  editBlog: (blogs: BlogBody, slug: string) => void;
  checkIfUserIsAllowed: (pathName: string) => boolean;
};
