import { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import mixpanel from 'mixpanel-browser';

// Enabling the debug mode flag is useful during implementation,
// but it's recommended you remove it for production
mixpanel.init('3d125cde8a93b243694e9f88ca3b2dce'); 
mixpanel.track('Land');

const Home = () => {
  // Max number of times we will retry for model loading (took my up to 5 mins)
  const maxRetries = 20;
  const [input, setInput] = useState('portrait of haytchde as ironman');
  const [img, setImg] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [retry, setRetry] = useState(0);
  const [retryCount, setRetryCount] = useState(maxRetries);
  const [finalPrompt, setFinalPrompt] = useState('');

  const generateAction = async () => {
    console.log('Generating...');

    if (isGenerating && retry === 0) return;

    setIsGenerating(true);

    // If this is a retry request, take away retryCount
    if (retry > 0) {
      setRetryCount((prevState) => {
        if (prevState === 0) {
          return 0;
        } else {
          return prevState - 1;
        }
      });

      setRetry(0);
    }

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: JSON.stringify({ input }),
    });

    // Everything should be returned in json
    const data = await response.json();

    // If model still loading, drop that retry time
    if (response.status === 503) {
      setRetry(data.estimated_time);
      return;
    }

    // If another error, drop error
    if (!response.ok) {
      console.log(`Error: ${data.error}`);
      setIsGenerating(false);
      return;
    }

    setFinalPrompt(input);
    setImg(data.image);
    setInput('');
    setIsGenerating(false);
  };

  // Helper to wait for number of seconds until we check model again
  const sleep = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  };

  const onChange = (event) => {
    mixpanel.track('Generate-click');
    setInput(event.target.value);
  };

  useEffect(() => {
    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(
          `Model still loading after ${maxRetries} retries. Try request again in 5 minutes.`
        );
        setRetryCount(maxRetries);
        setIsGenerating(false);
        return;
      }

      console.log(`Trying again in ${retry} seconds.`);

      await sleep(retry * 1000);

      await generateAction();
    };

    if (retry === 0) {
      return;
    }

    runRetry();
  }, [retry]);

  return (
    <div className="root">
      <Head>
        <title>AI Avatar Generator | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Haytch generator</h1>
          </div>
          <div className="header-subtitle">
            <h2>Make an image of me doing anything! Use "haytchde" in prompt</h2>
          </div>
          <div className="prompt-container">
            <input className="prompt-box" value={input} onChange={onChange} />
            <div className="prompt-buttons">
              <a
                className={
                  isGenerating ? 'generate-button loading' : 'generate-button'
                }
                onClick={generateAction}
              >
                <div className="generate">
                  {isGenerating ? (
                    <span className="loader"></span>
                  ) : (
                    <p>Generate</p>
                  )}
                </div>
              </a>
            </div>
          </div>
        </div>
        {img && (
          <div className="output-content">
            <Image src={img} width={512} height={512} alt={finalPrompt} />
            <p>{finalPrompt}</p>
          </div>
        )}
      </div>
      <div className="badge-container grow">
        <a
          href="https://twitter.com/haytchde"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <p>@haytchde</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;
