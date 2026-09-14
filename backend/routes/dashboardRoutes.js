const express = require("express");
const Sale = require("../models/Sale");
const Product = require("../models/Product");


const router = express.Router();

// DASHBOARD STATISTICS
router.get("/stats", async (req, res) => {
    try {

        // Get all sales
        const sales = await Sale.find();

        // Total sales amount
        const totalSales = sales.reduce(
            (sum, sale) => sum + sale.totalAmount,
            0
        );

        // Total profit
        const totalProfit = sales.reduce(
            (sum, sale) => sum + sale.totalProfit,
            0
        );

        // Get today's date
        const today = new Date();

        const startOfDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        const endOfDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() + 1
        );

        // Today's sales
        const todaySales = sales.filter(
            (sale) =>
                sale.createdAt >= startOfDay &&
                sale.createdAt < endOfDay
        );

        // Today's total sales
        const todayTotalSales = todaySales.reduce(
            (sum, sale) => sum + sale.totalAmount,
            0
        );

        // Today's profit
        const todayTotalProfit = todaySales.reduce(
            (sum, sale) => sum + sale.totalProfit,
            0
        );

        res.status(200).json({
            totalSales,
            totalProfit,
            todayTotalSales,
            todayTotalProfit,
            totalBills: sales.length
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error fetching dashboard statistics",
            error: error.message
        });
    }
});

// WORKER PERFORMANCE
router.get("/workers", async (req, res) => {
    try {

        const sales = await Sale.find()
            .populate("worker", "name email");

        const workerData = {};

        for (const sale of sales) {

            if (!sale.worker) {
                continue;
            }

            const workerId = sale.worker._id.toString();

            if (!workerData[workerId]) {

                workerData[workerId] = {
                    workerId: workerId,
                    name: sale.worker.name,
                    email: sale.worker.email,
                    totalBills: 0,
                    totalSales: 0,
                    totalProfit: 0
                };
            }

            workerData[workerId].totalBills += 1;

            workerData[workerId].totalSales +=
                sale.totalAmount;

            workerData[workerId].totalProfit +=
                sale.totalProfit;
        }

        const workers = Object.values(workerData);

        res.status(200).json(workers);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error fetching worker performance",
            error: error.message
        });
    }
});

// Inventory analytics
router.get("/inventory", async (req, res) => {
    try {

        const products = await Product.find();

        let totalStock = 0;
        let lowStockProducts = [];

        for (const product of products) {

            totalStock += product.stock;

            if (product.stock <= product.minimumStock) {
                lowStockProducts.push({
                    id: product._id,
                    name: product.name,
                    category: product.category,
                    stock: product.stock,
                    minimumStock: product.minimumStock
                });
            }
        }

        res.status(200).json({
            totalProducts: products.length,
            totalStock: totalStock,
            lowStockCount: lowStockProducts.length,
            lowStockProducts: lowStockProducts
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error fetching inventory analytics",
            error: error.message
        });
    }
});
module.exports = router;