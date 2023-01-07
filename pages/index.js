import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

const Home = () => {
  const [input, setInput] = useState('');
  const [img, setImg] = useState('');

  const onChange = (event) => {
    setInput(event.target.value);
  };
  const generateAction = async () => {
    console.log('Generating...');
  
    // Add the fetch request
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: JSON.stringify({ input }),
    });
  
    const data = await response.json();

    // If model still loading, drop that retry time
    if (response.status === 503) {
      console.log('Model is loading still :(.')
      return;
    }

    // If another error, drop error
    if (!response.ok) {
      console.log(`Error: ${data.error}`);
      return;
    }

    setImg(data.image);
  };

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
          <div className="prompt-container">
            <input className="prompt-box" value={input} onChange={onChange} />
            {/* Add your prompt button in the prompt container */}
            <div className="prompt-buttons">
              <a className="generate-button">
                <div className="generate" onClick={generateAction}>
                  <p>Generate</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
