import dotenv from "dotenv";
dotenv.config();

import User from './models/User.js';
import bcrypt from 'bcrypt';
import connectToDatabase from './db/db.js';

const userRegister = async () => {
    await connectToDatabase(); // Make sure to await this function

    try {
        const hashPassword = await bcrypt.hash("admin", 10);
        const newUser = new User({
            name: "Sumaira",
            email: "sumaira@gmail.com",
            password: hashPassword,
            role: "admin"
        });

        await newUser.save();
        console.log("User created successfully");
    } catch (error) {
        console.log("Error creating user:", error);
    }
};

userRegister();
