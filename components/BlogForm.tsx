import { useContext, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { GlobalContext } from '../context';
import { Blog, BlogBody } from '../types';

const BlogForm = ({ editMode }: { editMode: boolean }) => {
  const { push, query } = useRouter();
  const { addBlog, editBlog, blogs } = useContext(GlobalContext);
  const [blogData, setBlogData] = useState<Blog>();
  const title = useRef<HTMLInputElement | null>(null);
  const description = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (editMode) {
      const blogData = blogs.find((el) => el.slug === query.blog);
      if (!blogData) {
        alert('blog not found');
      } else setBlogData(blogData);
    }
  }, [editMode]);

  const onSubmit = (e: any) => {
    e.preventDefault();
    const blog: BlogBody = {
      title: title?.current?.value || '',
      description: description?.current?.value || ''
    };

    if (!blog.title || !blog.description) return alert('Title and Description are required');

    editMode ? addBlog(blog) : editBlog(blog, query.blog?.toString() || '');
    push('/');
  };

  const titleText = editMode ? 'Edit' : 'Create';

  return (
    <div>
      <h2>{titleText} Blog</h2>
      <form onSubmit={onSubmit}>
        <input
          ref={title}
          value={blogData?.title}
          placeholder="Enter blog title here.."
          className="text-input"
          type="text"
        />
        <br />
        <textarea
          ref={description}
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
