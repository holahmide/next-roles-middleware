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
