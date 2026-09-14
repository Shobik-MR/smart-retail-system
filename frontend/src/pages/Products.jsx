import { useEffect, useState } from "react";

function Products() {

    const [products, setProducts] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        category: "",
        purchasePrice: "",
        sellingPrice: "",
        stock: "",
        minimumStock: "",
        supplier: ""
    });

    // Get products from backend
    const fetchProducts = async () => {
        try {

            const response = await fetch(
                "http://localhost:5000/api/products"
            );

            const data = await response.json();

            setProducts(data);

        } catch (error) {
            console.log("Error fetching products:", error);
        }
    };


    // Run when page loads
    useEffect(() => {
        fetchProducts();
    }, []);


    // Handle input changes
    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    // Add product
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:5000/api/products",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        ...formData,
                        purchasePrice: Number(formData.purchasePrice),
                        sellingPrice: Number(formData.sellingPrice),
                        stock: Number(formData.stock),
                        minimumStock: Number(formData.minimumStock)
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert("Product added successfully");

                // Clear form
                setFormData({
                    name: "",
                    category: "",
                    purchasePrice: "",
                    sellingPrice: "",
                    stock: "",
                    minimumStock: "",
                    supplier: ""
                });

                // Refresh product list
                fetchProducts();

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log("Error:", error);
            alert("Cannot connect to server");

        }
    };
    const handleEdit = async (product) => {

    const newStock = prompt(
        "Enter new stock:",
        product.stock
    );

    if (newStock === null) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/products/${product._id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    stock: Number(newStock)
                })
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert("Product updated successfully");

            fetchProducts();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.log(error);

        alert("Cannot connect to server");
    }
};
const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/products/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (response.ok) {

            alert("Product deleted successfully");

            fetchProducts();

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.log(error);

        alert("Cannot connect to server");
    }
};


    return (
        <div>

            <h1>Product Management</h1>


            {/* ADD PRODUCT FORM */}

            <h2>Add Product</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Product Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="number"
                    name="purchasePrice"
                    placeholder="Purchase Price"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="number"
                    name="sellingPrice"
                    placeholder="Selling Price"
                    value={formData.sellingPrice}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="number"
                    name="minimumStock"
                    placeholder="Minimum Stock"
                    value={formData.minimumStock}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <input
                    type="text"
                    name="supplier"
                    placeholder="Supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                />

                <br /><br />

                <button type="submit">
                    Add Product
                </button>

            </form>


            {/* PRODUCT LIST */}

            <h2>Products</h2>
             
             {products.some(
    (product) => product.stock <= product.minimumStock
) && (
    <div>
        ⚠️ Some products are low in stock. Reorder required!
    </div>
)}


            {products.length === 0 ? (

                <p>No products available.</p>

            ) : (

                <table border="1" cellPadding="10">

                    <thead>

                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Purchase Price</th>
                            <th>Selling Price</th>
                            <th>Stock</th>
                            <th>Minimum Stock</th>
                            <th>Supplier</th>
                            <th>Actions</th>
                        </tr>

                    </thead>

                    <tbody>

                        {products.map((product) => (

                            <tr key={product._id}>

                                <td>{product.name}</td>

                                <td>{product.category}</td>

                                <td>₹{product.purchasePrice}</td>

                                <td>₹{product.sellingPrice}</td>

                               <td>
    {product.stock}

    {" "}

    {product.stock <= product.minimumStock ? (
        <span>🔴 Low Stock</span>
    ) : (
        <span>🟢 In Stock</span>
    )}
                               </td>
                                  
                                <td>{product.minimumStock}</td>

                                <td>{product.supplier}</td>
                                <td>
    <button onClick={() => handleEdit(product)}>
        Edit
    </button>

    {" "}

    <button onClick={() => handleDelete(product._id)}>
        Delete
    </button>
</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            )}

        </div>
    );
}

export default Products;