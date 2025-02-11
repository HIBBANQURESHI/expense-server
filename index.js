import express from 'express'
import cors from 'cors'
import connectToDatabase from './db/db.js'
import dotenv from "dotenv";
import saleRoutes from "./routes/saleRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import parcelRoutes from "./routes/parcelRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";


dotenv.config();

connectToDatabase();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/sales", saleRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/parcel", parcelRoutes);
app.use("/api/loan", loanRoutes);
app.use("/api/delivery", deliveryRoutes);


app.listen(process.env.PORT, () => {
    console.log(`Server Is Running On ${process.env.PORT}`);
}) 