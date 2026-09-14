import { useEffect, useState } from "react";

function Billing() {

    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [cart, setCart] = useState([]);

    // Get products
    useEffect(() => {
        fetch("http://localhost:5000/api/products")
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, []);

    // Add product to bill
    const addToBill = () => {

        if (!selectedProduct) {
            alert("Please select a product");
            return;
        }

        const product = products.find(
            (p) => p._id === selectedProduct
        );

        if (!product) {
            return;
        }

        if (quantity > product.stock) {
            alert("Not enough stock");
            return;
        }

        const existingItem = cart.find(
            (item) => item.product === product._id
        );

        if (existingItem) {

            const newQuantity =
                existingItem.quantity + Number(quantity);

            if (newQuantity > product.stock) {
                alert("Not enough stock");
                return;
            }

            setCart(
                cart.map((item) =>
                    item.product === product._id
                        ? {
                            ...item,
                            quantity: newQuantity,
                            total: product.sellingPrice * newQuantity
                        }
                        : item
                )
            );

        } else {

            setCart([
                ...cart,
                {
                    product: product._id,
                    name: product.name,
                    quantity: Number(quantity),
                    price: product.sellingPrice,
                    total: product.sellingPrice * Number(quantity)
                }
            ]);
        }

        setQuantity(1);
        setSelectedProduct("");
    };

    // Remove product from bill
    const removeFromBill = (productId) => {
        setCart(
            cart.filter((item) => item.product !== productId)
        );
    };

    // Calculate total
    const totalAmount = cart.reduce(
        (total, item) => total + item.total,
        0
    );

    // Complete sale
    const completeSale = async () => {

        if (cart.length === 0) {
            alert("Bill is empty");
            return;
        }

        const user = JSON.parse(
            localStorage.getItem("user")
        );

        if (!user) {
            alert("Please login again");
            return;
        }

        const saleData = {
            worker: user.id,
            items: cart.map((item) => ({
                product: item.product,
                quantity: item.quantity
            }))
        };

        try {

            const response = await fetch(
                "http://localhost:5000/api/sales",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(saleData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
                return;
            }

            alert("Sale completed successfully!");

            setCart([]);

        } catch (error) {

            console.error(error);

            alert("Error completing sale");
        }
    };

    return (
        <div>

            <h1>Create Bill</h1>

            <div>

                <label>Product:</label>

                <select
                    value={selectedProduct}
                    onChange={(e) =>
                        setSelectedProduct(e.target.value)
                    }
                >
                    <option value="">
                        Select Product
                    </option>

                    {products.map((product) => (
                        <option
                            key={product._id}
                            value={product._id}
                            disabled={product.stock === 0}
                        >
                            {product.name} - ₹
                            {product.sellingPrice}
                            {" "}({product.stock} available)
                        </option>
                    ))}

                </select>

            </div>

            <div>

                <label>Quantity:</label>

                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                        setQuantity(Number(e.target.value))
                    }
                />

            </div>

            <button onClick={addToBill}>
                Add to Bill
            </button>


            <h2>Bill Items</h2>

            {cart.length === 0 ? (

                <p>No items added</p>

            ) : (

                <table border="1">

                    <thead>

                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {cart.map((item) => (

                            <tr key={item.product}>

                                <td>{item.name}</td>

                                <td>{item.quantity}</td>

                                <td>₹{item.price}</td>

                                <td>₹{item.total}</td>

                                <td>

                                    <button
                                        onClick={() =>
                                            removeFromBill(
                                                item.product
                                            )
                                        }
                                    >
                                        Remove
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>
            )}


            <h2>
                Total: ₹{totalAmount}
            </h2>

            <button onClick={completeSale}>
                Complete Sale
            </button>

        </div>
    );
}

export default Billing;