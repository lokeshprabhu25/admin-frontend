import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const USER_API = "http://3.26.78.110:8001";
const ORDER_API = "http://3.26.78.110:8002";

function App() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dependency, setDependency] = useState("Checking...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [usersResponse, ordersResponse, dependencyResponse] = await Promise.all([
        fetch(`${USER_API}/users`),
        fetch(`${ORDER_API}/orders`),
        fetch(`${ORDER_API}/dependency-check`)
      ]);

      const usersData = await usersResponse.json();
      const ordersData = await ordersResponse.json();
      const dependencyData = await dependencyResponse.json();

      setUsers(usersData.users || []);
      setOrders(ordersData.orders || []);

      setDependency(
        dependencyResponse.ok
          ? "🟢 Order Service → User Service dependency is HEALTHY"
          : `🔴 ${dependencyData.detail}`
      );
    } catch (err) {
      setDependency("🔴 Backend services unavailable");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header>
        <h1>ShopFlow Admin</h1>
        <span>Admin React Frontend</span>
      </header>

      <main>
        <div className="dependency">{dependency}</div>

        <div className="stats">
          <div className="stat"><span>Users</span><b>{users.length}</b></div>
          <div className="stat"><span>Orders</span><b>{orders.length}</b></div>
          <div className="stat"><span>System</span><b>🟢</b></div>
        </div>

        <section className="card">
          <div className="titleRow">
            <h2>Users</h2>
            <button onClick={loadAll}>Refresh</button>
          </div>

          {loading ? <p>Loading...</p> : (
            <table>
              <thead>
                <tr><th>ID</th><th>Username</th><th>Name</th></tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.username}</td>
                    <td>{u.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="card">
          <h2>Orders</h2>

          <table>
            <thead>
              <tr>
                <th>ID</th><th>Customer</th><th>Product</th>
                <th>Qty</th><th>Amount</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.customer_name}</td>
                  <td>{o.product}</td>
                  <td>{o.quantity}</td>
                  <td>₹{o.amount}</td>
                  <td className="success">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
