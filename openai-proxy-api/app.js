const express = require('express');
const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Running OpenAI Proxy API');
});

app.post('/embeddings', async (req, res) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    const model = req.body.model || "text-embedding-ada-002";
    const input = req.body.input.replace("*", " ").replace("\n", " ")

    try {
        const response = await openai.embeddings.create({
            model,
            input
        });

        if (response.data && response.data.length > 0) {
            console.log(response.data[0].embedding);
            res.json(response.data[0].embedding);
        } else {
            res.status(500).send('Unexpected response structure from OpenAI API');
        }
    } catch (error) {
        console.error('Error creating embeddings:', error);
        res.status(500).send('Error creating embeddings');
    }
});

app.listen(3000, "0.0.0.0", () => {
  console.log('Server is running on port http://localhost:3000');
});