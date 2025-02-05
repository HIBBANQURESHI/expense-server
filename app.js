import express from "express";
import cors from "cors";
import { connectDB } from "./DB/Database.js";
import dotenv from "dotenv";
import transactionRoutes from "./Routers/Transactions.js";
import userRoutes from "./Routers/userRouter.js";

dotenv.config();
const app = express();

const port = process.env.PORT;

connectDB(); 

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["https://akc-expense.vercel.app"], // Frontend origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies and credentials
  })
);
 
// Router
app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
