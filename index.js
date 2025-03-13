import express from 'express'
import cors from 'cors'
import connectToDatabase from './db/db.js'
import dotenv from "dotenv";
import saleRoutes from "./routes/saleRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import parcelRoutes from "./routes/parcelRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import cardSaleRoutes from './routes/cardSaleRoutes.js';
import BroozeRoutes from './routes/brooze.js';
import KpmgRoutes from './routes/kpmg.js';
import KeetaRoutes from './routes/deliveryRoutes.js';
import hungerRoutes from './routes/hungerRoutes.js';
import noonRoutes from './routes/noonRoutes.js';
import jahezRoutes from './routes/jahezRoutes.js';
import marsoolRoutes from './routes/marsoolRoutes.js';
import ninjaRoutes from './routes/NinjaRoutes.js';
import receivingRoutes from './routes/receiving.js';
import balanceSheetRoutes from "./routes/balanceSheet.js";
import cardBalanceRoutes from "./routes/cardBalance.js";




dotenv.config();

connectToDatabase();

const app = express();
app.use(express.json());
app.use(
    cors({
      origin: ["https://expense-tracker-ivory-nine.vercel.app", "http://localhost:3000"], // Frontend origin
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
      allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
      credentials: true, // Allow cookies and credentials
    })
  );

// Routes
app.use("/api/sales", saleRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/parcel", parcelRoutes);
app.use("/api/loan", loanRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/cardsale", cardSaleRoutes);
app.use("/api/brooze", BroozeRoutes);
app.use("/api/kpmg", KpmgRoutes);
app.use("/api/keeta", KeetaRoutes);
app.use("/api/hunger", hungerRoutes);
app.use("/api/noon", noonRoutes);
app.use("/api/jahez", jahezRoutes);
app.use("/api/marsool", marsoolRoutes);
app.use("/api/ninja", ninjaRoutes);
app.use("/api/receiving", receivingRoutes);
app.use("/api/balance", balanceSheetRoutes);
app.use("/api/card-balance", cardBalanceRoutes);



app.listen(process.env.PORT, () => {
    console.log(`Server Is Running On ${process.env.PORT}`);
}) 