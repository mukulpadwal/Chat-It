import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

// We are configuring with our open AI account 
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

// Get request

app.get("/", async (req, res) => {
    res.status(200).send({"message": "HALLO THERE"});
})

// Post request

app.post("/", async (req, res) => {
    try {

        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({bot: response.data});

    } catch (error){
        console.log(error);
        res.status(500).send({error});
    }
});


app.listen(3000, () => {
    console.log("Server Up and running on http://localhost:3000");
});

