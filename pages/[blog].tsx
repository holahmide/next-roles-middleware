import { useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { GlobalContext } from '../context';
import { BlogBody } from '../types';

const EditBlog = () => {
  const { push } = useRouter();
  const { addBlog } = useContext(GlobalContext);
  const title = useRef<HTMLInputElement | null>(null);
  const description = useRef<HTMLTextAreaElement | null>(null);

  const onSubmit = (e: any) => {
    e.preventDefault();
    const blog: BlogBody = {
      title: title?.current?.value || '',
      description: description?.current?.value || ''
    };

    if (!blog.title || !blog.description) return alert('Title and Description are required');

    addBlog(blog);
    push('/');
  };

  return (
    <div>
      <h2>Edit Blog</h2>
      <form onSubmit={onSubmit}>
        <input placeholder="Enter blog title here.." className="text-input" type="text" />
        <br />
        <textarea placeholder="Enter blog content here.." rows={3} className="text-input" />
        <br />
        <button className="button">Edit</button>
      </form>
    </div>
  );
};

export default EditBlog;
