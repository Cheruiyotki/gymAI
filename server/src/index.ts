import express from 'express'
import cors from 'cors'
import cookiePaser from 'cookie-parser'
import dotenv from 'dotenv'
import { profileRouter } from './routes/profile'
import { planRouter } from './routes/plan'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(cookiePaser());
app.use(express.json());


//API Routes
app.use("/api/profile", profileRouter);
app.use("/api/plan", planRouter);

app.listen(PORT, () =>  {
    console.log(`Server running on port: ${PORT}`)
})
