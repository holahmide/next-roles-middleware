import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <div className="blogs-container">
      <Head>
        <title>Blogs</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h2>All Blogs</h2>
      <div>
        <div className="blog-container">
          <p>
            <b>Lorem ipsum dolor sit amet consectetur adipisicing elit.</b>
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat rem voluptatum ab
            recusandae. Quis itaque quia ipsam impedit ad voluptates provident maiores praesentium
            dolor doloribus hic, officia blanditiis doloremque! Assumenda?
          </p>
        </div>

        <div className="blog-container">
          <p>
            <b>Lorem ipsum dolor sit amet consectetur adipisicing elit.</b>
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat rem voluptatum ab
            recusandae. Quis itaque quia ipsam impedit ad voluptates provident maiores praesentium
            dolor doloribus hic, officia blanditiis doloremque! Assumenda?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
