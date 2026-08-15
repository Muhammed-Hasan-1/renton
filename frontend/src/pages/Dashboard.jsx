import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("rentonUser");

    if (!savedUser) {
      navigate("/signin");
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch (error) {
      console.error("Invalid user data:", error);
      localStorage.removeItem("rentonUser");
      localStorage.removeItem("rentonToken");
      navigate("/signin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("rentonToken");
    localStorage.removeItem("rentonUser");

    navigate("/signin");
  };

  if (!user) {
    return (
      <div className="dashboard-loading">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* Dashboard Header */}
      <section className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            RENTON DASHBOARD
          </p>

          <h1>
            Welcome back, {user.name}!
          </h1>

          <p>
            Manage your equipment rentals, bookings and account.
          </p>
        </div>

        <button
          className="dashboard-logout"
          onClick={handleLogout}
        >
          Logout
        </button>
      </section>


      {/* Account Summary */}
      <section className="dashboard-stats">

        <div className="dashboard-stat-card">
          <span className="stat-icon">🛠️</span>

          <div>
            <p>Active Rentals</p>
            <h2>0</h2>
          </div>
        </div>


        <div className="dashboard-stat-card">
          <span className="stat-icon">📦</span>

          <div>
            <p>Total Rentals</p>
            <h2>0</h2>
          </div>
        </div>


        <div className="dashboard-stat-card">
          <span className="stat-icon">📅</span>

          <div>
            <p>Upcoming Returns</p>
            <h2>0</h2>
          </div>
        </div>


        <div className="dashboard-stat-card">
          <span className="stat-icon">❤️</span>

          <div>
            <p>Saved Equipment</p>
            <h2>0</h2>
          </div>
        </div>

      </section>


      {/* Main Dashboard Content */}
      <section className="dashboard-content">

        {/* Recent Rentals */}
        <div className="dashboard-panel">

          <div className="panel-header">
            <div>
              <h2>Recent Rentals</h2>

              <p>
                Your latest equipment rentals will appear here.
              </p>
            </div>

            <Link to="/equipment">
              Browse Equipment
            </Link>
          </div>


          <div className="empty-rentals">

            <div className="empty-icon">
              🛠️
            </div>

            <h3>No rentals yet</h3>

            <p>
              You haven't rented any equipment yet.
              Find the right equipment for your next project.
            </p>

            <Link
              to="/equipment"
              className="dashboard-primary-button"
            >
              Browse Equipment
            </Link>

          </div>

        </div>


        {/* Account Information */}
        <div className="dashboard-panel">

          <div className="panel-header">
            <div>
              <h2>Account Information</h2>

              <p>
                Your Renton account details.
              </p>
            </div>
          </div>


          <div className="account-details">

            <div className="account-row">
              <span>Name</span>
              <strong>{user.name}</strong>
            </div>

            <div className="account-row">
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>

            <div className="account-row">
              <span>Role</span>
              <strong>
                {user.role === "owner"
                  ? "Equipment Owner"
                  : "Customer"}
              </strong>
            </div>

          </div>

        </div>

      </section>


      {/* Quick Actions */}
      <section className="quick-actions">

        <h2>Quick Actions</h2>

        <div className="quick-action-grid">

          <Link
            to="/equipment"
            className="quick-action-card"
          >
            <span>🔎</span>

            <div>
              <h3>Find Equipment</h3>
              <p>
                Browse available tools and equipment.
              </p>
            </div>
          </Link>


          <Link
            to="/categories"
            className="quick-action-card"
          >
            <span>📂</span>

            <div>
              <h3>Browse Categories</h3>
              <p>
                Find equipment by category.
              </p>
            </div>
          </Link>


          <Link
            to="/feedback"
            className="quick-action-card"
          >
            <span>💬</span>

            <div>
              <h3>Give Feedback</h3>
              <p>
                Tell us about your Renton experience.
              </p>
            </div>
          </Link>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;