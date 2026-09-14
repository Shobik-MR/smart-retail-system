import { useEffect, useState } from "react";

function Sales() {

    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetch("http://localhost:5000/api/sales")
            .then((response) => response.json())
            .then((data) => {
                setSales(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching sales:", error);
                setLoading(false);
            });

    }, []);

    if (loading) {
        return <h2>Loading sales...</h2>;
    }

    return (
        <div>

            <h1>Sales History</h1>

            {sales.length === 0 ? (

                <p>No sales found.</p>

            ) : (

                <table border="1">

                    <thead>

                        <tr>
                            <th>Date</th>
                            <th>Worker</th>
                            <th>Products</th>
                            <th>Total Amount</th>
                            <th>Profit</th>
                        </tr>

                    </thead>

                    <tbody>

                        {sales.map((sale) => (

                            <tr key={sale._id}>

                                <td>
                                    {new Date(
                                        sale.createdAt
                                    ).toLocaleString()}
                                </td>

                                <td>
                                    {sale.worker
                                        ? sale.worker.name
                                        : "Unknown"}
                                </td>

                                <td>

                                    {sale.items.map((item) => (

                                        <div key={item._id}>

                                            {item.product
                                                ? item.product.name
                                                : "Unknown Product"}

                                            {" × "}

                                            {item.quantity}

                                        </div>

                                    ))}

                                </td>

                                <td>
                                    ₹{sale.totalAmount}
                                </td>

                                <td>
                                    ₹{sale.totalProfit}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>
            )}

        </div>
    );
}

export default Sales;