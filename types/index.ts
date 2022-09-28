export type Blog = { slug: string; title: string; description: string };

export type BlogBody = Pick<Blog, 'title' | 'description'>;

export type Roles = 'EDITOR' | 'ADMIN' | 'SUPER_ADMIN';
