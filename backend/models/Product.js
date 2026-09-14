const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        purchasePrice: {
            type: Number,
            required: true,
            min: 0
        },

        sellingPrice: {
            type: Number,
            required: true,
            min: 0
        },

        stock: {
            type: Number,
            required: true,
            min: 0
        },

        minimumStock: {
            type: Number,
            required: true,
            min: 0
        },

        supplier: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);