const express = require("express");
const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");
const authorizeRole = require("../middleware/roleMiddleware");

const router = express.Router();


// ===============================
// ADD PRODUCT
// ===============================
router.post("/", protect,authorizeRole("manager"),
async (req, res) => {
    try {
        const {
            name,
            category,
            purchasePrice,
            sellingPrice,
            stock,
            minimumStock,
            supplier
        } = req.body;

        // Check required fields
        if (
            !name ||
            !category ||
            purchasePrice === undefined ||
            sellingPrice === undefined ||
            stock === undefined ||
            minimumStock === undefined
        ) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        // Create product
        const product = await Product.create({
            name,
            category,
            purchasePrice,
            sellingPrice,
            stock,
            minimumStock,
            supplier
        });

        res.status(201).json({
            message: "Product added successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


// ===============================
// GET ALL PRODUCTS
// ===============================
router.get("/",protect, async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


// ===============================
// GET ONE PRODUCT
// ===============================
router.get("/:id",protect, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


// ===============================
// UPDATE PRODUCT
// ===============================
router.put("/:id",protect,authorizeRole("manager"),async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
               returnDocument: "after",
               runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


// ===============================
// DELETE PRODUCT
// ===============================
router.delete("/:id",protect,authorizeRole("manager"),
async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});


module.exports = router;