import express from 'express'
import cors from 'cors'
import connectToDatabase from './db/db.js'
import dotenv from "dotenv";
import saleRoutes from "./routes/saleRoutes.js";


dotenv.config();

connectToDatabase();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/sales", saleRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server Is Running On ${process.env.PORT}`);
}) 