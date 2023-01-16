import  express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const openai = new OpenAIApi(
        new Configuration({
            apiKey: process.env.OPEN_AI_API_KEY
        })
    );

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async(req, res) => {
    res.status(200).send({
        message: 'Hello talkible!'
    })
});

app.post('/', async(req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model:"text-davinci-003",
            prompt:`${prompt}`,
            temperature:0.8, //higher values, more risks
            max_tokens:3000, //maximum number of tokens to generate in the completion.
            // top_p:1, //alternative to sampling with temperature
            // frequency_penalty:0.5, //frequency to repeat the same line verbatim
            // presence_penalty:0,
        });
        res.status(200).send({
            bot:response.data.choices[0].text
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong!');
    }
});

app.listen(5000, () => console.log('server started on http://localhost:5000'))