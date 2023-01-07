const generateAction = async (req, res) => {
    console.log('Received request');
  
    const input = JSON.parse(req.body).input;
  
    // Add fetch request to Hugging Face
    const response = await fetch(
      `https://api-inference.huggingface.co/models/haytch/sd-1-5-haytch`,
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_AUTH_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: input,
        }),
      }
    );
  };

  export default generateAction;