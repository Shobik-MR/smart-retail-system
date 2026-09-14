import { useState } from "react";

function Register() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "worker"
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            console.log(data);

            if (response.ok) {
                alert("Registration successful!");
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error(error);
            alert("Cannot connect to server");
        }
    };

    return (
        <div>
            <h1>Smart Retail</h1>

            <h2>Register</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="name"
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <br /><br />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <br /><br />

                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                >
                    <option value="worker">Worker</option>
                    <option value="manager">Manager</option>
                </select>

                <br /><br />

                <button type="submit">
                    Register
                </button>

            </form>
        </div>
    );
}

export default Register;