import { useState } from "react";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            console.log(data);

            if (response.ok) {

                localStorage.setItem("token", data.token);

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                alert("Login successful!");

                window.location.href = "/dashboard";

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

            <h2>Login</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br /><br />

                <button type="submit">
                    Login
                </button>

            </form>

        </div>
    );
}

export default Login;