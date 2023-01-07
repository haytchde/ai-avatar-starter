import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

const Home = () => {
  return (
    <div className="root">
      <Head>
        <title>Harry generator</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Harry generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>
              Turn me into anyone you want! Use "haytchde" in the prompt
            </h2>
          </div>
          {/* Add prompt container here */}
          <div className="prompt-container">
            <input className="prompt-box" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
