const express = require("express");
const Sale = require("../models/Sale");
const Product = require("../models/Product");

const router = express.Router();

// CREATE SALE / BILL
router.post("/", async (req, res) => {
    try {
        const { worker, items } = req.body;

        // Basic validation
        if (!worker || !items || items.length === 0) {
            return res.status(400).json({
                message: "Worker and items are required"
            });
        }

        let totalAmount = 0;
        let totalProfit = 0;

        const saleItems = [];

        // Process every product in the bill
        for (const item of items) {

            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    message: `Product not found: ${item.product}`
                });
            }

            // Check stock
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}`
                });
            }

            const quantity = Number(item.quantity);

            const price = product.sellingPrice;
            const purchasePrice = product.purchasePrice;

            const total = price * quantity;

            const profit =
                (price - purchasePrice) * quantity;

            totalAmount += total;
            totalProfit += profit;

            // Store item inside sale
            saleItems.push({
                product: product._id,
                quantity: quantity,
                price: price,
                purchasePrice: purchasePrice,
                total: total
            });

            // Reduce stock
            product.stock -= quantity;

            await product.save();
        }

        // Create sale
        const sale = await Sale.create({
            worker: worker,
            items: saleItems,
            totalAmount: totalAmount,
            totalProfit: totalProfit
        });

        res.status(201).json({
            message: "Sale created successfully",
            sale: sale
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error creating sale",
            error: error.message
        });
    }
});
// GET ALL SALES
router.get("/", async (req, res) => {
    try {
        const sales = await Sale.find()
            .populate("worker", "name email")
            .populate("items.product", "name category");

        res.status(200).json(sales);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error fetching sales",
            error: error.message
        });
    }
});


// GET SALES OF A PARTICULAR WORKER
router.get("/worker/:workerId", async (req, res) => {
    try {
        const sales = await Sale.find({
            worker: req.params.workerId
        })
            .populate("worker", "name email")
            .populate("items.product", "name category");

        res.status(200).json(sales);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Error fetching worker sales",
            error: error.message
        });
    }
});

module.exports = router;