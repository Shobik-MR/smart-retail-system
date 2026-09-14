function Dashboard() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
    };

    return (
        <div>

            <h1>Smart Retail Dashboard</h1>

            <h2>Welcome, {user?.name}</h2>

            <p>
                Role: {user?.role}
            </p>

            <button onClick={logout}>
                Logout
            </button>

        </div>
    );
}

export default Dashboard;