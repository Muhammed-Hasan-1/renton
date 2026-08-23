import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [rentals, setRentals] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("rentonUser");
    const token = localStorage.getItem("rentonToken");

    if (!savedUser || !token) {
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

  useEffect(() => {
    const fetchRentals = async () => {
      const token = localStorage.getItem("rentonToken");

      if (!token) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:5000/api/rentals/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setRentals(response.data);
      } catch (error) {
        console.error("Failed to fetch rentals:", error);

        setError(
          error.response?.data?.message ||
            "Unable to load your rentals."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("rentonToken");
    localStorage.removeItem("rentonUser");

    navigate("/signin");
  };

  if (!user || loading) {
    return (
      <div className="dashboard-loading">
        Loading dashboard...
      </div>
    );
  }

  /*
   * ==============================
   * DASHBOARD STATISTICS
   * ==============================
   */

  const activeRentals = rentals.filter(
    (rental) =>
      rental.status === "confirmed" ||
      rental.status === "active"
  ).length;

  const totalRentals = rentals.length;

  const upcomingReturns = rentals.filter((rental) => {
    if (
      rental.status === "cancelled" ||
      rental.status === "completed"
    ) {
      return false;
    }

    return new Date(rental.endDate) >= new Date();
  }).length;

  return (
    <div className="dashboard-page">

      {/* ==============================
          DASHBOARD HEADER
      ============================== */}

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


      {/* ==============================
          ACCOUNT SUMMARY
      ============================== */}

      <section className="dashboard-stats">

        <div className="dashboard-stat-card">
          <span className="stat-icon">
            🛠️
          </span>

          <div>
            <p>Active Rentals</p>
            <h2>{activeRentals}</h2>
          </div>
        </div>


        <div className="dashboard-stat-card">
          <span className="stat-icon">
            📦
          </span>

          <div>
            <p>Total Rentals</p>
            <h2>{totalRentals}</h2>
          </div>
        </div>


        <div className="dashboard-stat-card">
          <span className="stat-icon">
            📅
          </span>

          <div>
            <p>Upcoming Returns</p>
            <h2>{upcomingReturns}</h2>
          </div>
        </div>


        <div className="dashboard-stat-card">
          <span className="stat-icon">
            ❤️
          </span>

          <div>
            <p>Saved Equipment</p>
            <h2>0</h2>
          </div>
        </div>

      </section>


      {/* ==============================
          ERROR
      ============================== */}

      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            borderRadius: "12px",
            background: "#fee2e2",
            color: "#b91c1c",
          }}
        >
          {error}
        </div>
      )}


      {/* ==============================
          MAIN CONTENT
      ============================== */}

      <section className="dashboard-content">

        {/* ==============================
            RECENT RENTALS
        ============================== */}

        <div className="dashboard-panel">

          <div className="panel-header">
            <div>
              <h2>Recent Rentals</h2>

              <p>
                Your latest equipment rentals.
              </p>
            </div>

            <Link to="/equipment">
              Browse Equipment
            </Link>
          </div>


          {rentals.length === 0 ? (

            <div className="empty-rentals">

              <div className="empty-icon">
                🛠️
              </div>

              <h3>
                No rentals yet
              </h3>

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

          ) : (

            <div className="rental-list">

              {rentals.slice(0, 5).map((rental) => (

                <div
                  key={rental._id}
                  className="rental-card"
                >

                  {/* Equipment Image */}

                  <img
                    src={rental.equipment?.image}
                    alt={
                      rental.equipment?.name ||
                      "Equipment"
                    }
                    className="rental-image"
                  />


                  {/* Rental Information */}

                  <div className="rental-info">

                    <div className="rental-title-row">

                      <div>

                        <h3>
                          {rental.equipment?.name ||
                            "Equipment"}
                        </h3>

                        <p>
                          {rental.equipment?.category ||
                            "Equipment"}
                        </p>

                      </div>


                      <span
                        className={`rental-status rental-status-${rental.status}`}
                      >
                        {rental.status}
                      </span>

                    </div>


                    <div className="rental-details">

                      <div>
                        <span>📅 Start</span>

                        <strong>
                          {new Date(
                            rental.startDate
                          ).toLocaleDateString()}
                        </strong>
                      </div>


                      <div>
                        <span>🔄 Return</span>

                        <strong>
                          {new Date(
                            rental.endDate
                          ).toLocaleDateString()}
                        </strong>
                      </div>


                      <div>
                        <span>💰 Total</span>

                        <strong>
                          ₹{rental.totalAmount}
                        </strong>
                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>


        {/* ==============================
            ACCOUNT INFORMATION
        ============================== */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <h2>
                Account Information
              </h2>

              <p>
                Your Renton account details.
              </p>

            </div>

          </div>


          <div className="account-details">

            <div className="account-row">

              <span>
                Name
              </span>

              <strong>
                {user.name}
              </strong>

            </div>


            <div className="account-row">

              <span>
                Email
              </span>

              <strong>
                {user.email}
              </strong>

            </div>


            <div className="account-row">

              <span>
                Role
              </span>

              <strong>

                {user.role === "owner"
                  ? "Equipment Owner"
                  : user.role === "admin"
                  ? "Administrator"
                  : "Customer"}

              </strong>

            </div>

          </div>

        </div>

      </section>


      {/* ==============================
          QUICK ACTIONS
      ============================== */}

      <section className="quick-actions">

        <h2>
          Quick Actions
        </h2>


        <div className="quick-action-grid">

          <Link
            to="/equipment"
            className="quick-action-card"
          >

            <span>
              🔎
            </span>

            <div>

              <h3>
                Find Equipment
              </h3>

              <p>
                Browse available tools and equipment.
              </p>

            </div>

          </Link>


          <Link
            to="/categories"
            className="quick-action-card"
          >

            <span>
              📂
            </span>

            <div>

              <h3>
                Browse Categories
              </h3>

              <p>
                Find equipment by category.
              </p>

            </div>

          </Link>


          <Link
            to="/feedback"
            className="quick-action-card"
          >

            <span>
              💬
            </span>

            <div>

              <h3>
                Give Feedback
              </h3>

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