import { useEffect, useState } from "react";
import SalesChart from "../components/SalesChart";
function Dashboard() {

    const [stats, setStats] = useState({
        totalSales: 0,
        totalProfit: 0,
        todayTotalSales: 0,
        todayTotalProfit: 0,
        totalBills: 0
    });

    const [workers, setWorkers] = useState([]);

    const [loading, setLoading] = useState(true);
    
    const [sales, setSales] = useState([]);

    const [inventory, setInventory] = useState({
    totalProducts: 0,
    totalStock: 0,
    lowStockCount: 0,
    lowStockProducts: []
});

    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                // Get dashboard statistics
                const statsResponse = await fetch(
                    "http://localhost:5000/api/dashboard/stats"
                );

                const statsData = await statsResponse.json();

                // Get worker performance
                const workersResponse = await fetch(
                    "http://localhost:5000/api/dashboard/workers"
                );

                const workersData = await workersResponse.json();

                const salesResponse = await fetch(
    "http://localhost:5000/api/sales"
);

const salesData = await salesResponse.json();
const inventoryResponse = await fetch(
    "http://localhost:5000/api/dashboard/inventory"
);

const inventoryData = await inventoryResponse.json();

setStats(statsData);
setWorkers(workersData);
setSales(salesData);
setInventory(inventoryData);

setLoading(false);

                setStats(statsData);
                setWorkers(workersData);

                setLoading(false);

            } catch (error) {

                console.error(
                    "Error fetching dashboard data:",
                    error
                );

                setLoading(false);
            }
        };

        fetchDashboardData();

    }, []);

    if (loading) {
        return <h2>Loading dashboard...</h2>;
    }

    return (
        <div>

            <h1>Smart Retail Dashboard</h1>

            {/* Statistics */}

            <div>

                <div>
                    <h3>Total Sales</h3>
                    <p>₹{stats.totalSales}</p>
                </div>

                <div>
                    <h3>Total Profit</h3>
                    <p>₹{stats.totalProfit}</p>
                </div>

                <div>
                    <h3>Today's Sales</h3>
                    <p>₹{stats.todayTotalSales}</p>
                </div>

                <div>
                    <h3>Today's Profit</h3>
                    <p>₹{stats.todayTotalProfit}</p>
                </div>

                <div>
                    <h3>Total Bills</h3>
                    <p>{stats.totalBills}</p>
                </div>

            </div>
            {/* Inventory Analytics */}

<h2>Inventory Analytics</h2>

<div>

    <div>
        <h3>Total Products</h3>
        <p>{inventory.totalProducts}</p>
    </div>

    <div>
        <h3>Total Stock</h3>
        <p>{inventory.totalStock}</p>
    </div>

    <div>
        <h3>Low Stock Products</h3>
        <p>{inventory.lowStockCount}</p>
    </div>

</div>

          <h2>Low Stock Alerts</h2>

{inventory.lowStockProducts.length === 0 ? (

    <p>🟢 No low stock products.</p>

) : (

    <table border="1">

        <thead>
            <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Minimum Stock</th>
                 <th>Status</th>
                 <th>Reorder Quantity</th>
            </tr>
        </thead>

        <tbody>

            {inventory.lowStockProducts.map((product) => (

               <tr key={product.id}>

    <td>{product.name}</td>

    <td>{product.category}</td>

    <td>
        🔴 {product.stock}
    </td>

    <td>
        {product.minimumStock}
    </td>

    <td>
        🔴 Reorder Required
    </td>
     <td>
                    {product.minimumStock - product.stock}
                </td>

</tr>

            ))}

        </tbody>

    </table>

)}


            {/* Worker Performance */}

            <h2>Worker Performance</h2>
             
             

            {workers.length === 0 ? (

                <p>No worker sales found.</p>

            ) : (

                <table border="1">

                    <thead>

                        <tr>
                            <th>Worker</th>
                            <th>Email</th>
                            <th>Total Bills</th>
                            <th>Total Sales</th>
                            <th>Total Profit</th>
                        </tr>

                    </thead>

                    <tbody>

                        {workers.map((worker) => (

                            <tr key={worker.workerId}>

                                <td>
                                    {worker.name}
                                </td>

                                <td>
                                    {worker.email}
                                </td>

                                <td>
                                    {worker.totalBills}
                                </td>

                                <td>
                                    ₹{worker.totalSales}
                                </td>

                                <td>
                                    ₹{worker.totalProfit}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>
                
            )}
            <SalesChart sales={sales} />

        </div>
    );
}

export default Dashboard;