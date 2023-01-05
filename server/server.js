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
        message: 'Hello world!'
    })
});

app.post('/', async(req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({

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