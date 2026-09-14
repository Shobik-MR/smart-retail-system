const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const app = express();

app.use(cors());
app.use(express.json());   // IMPORTANT

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.get("/", (req, res) => {
    res.send("Smart Retail Backend is running");
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed");
        console.log(error.message);
    });