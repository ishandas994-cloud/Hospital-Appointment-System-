import { useEffect, useState } from "react";

import { getDashboardData } from "../../api/adminAPI";

import Spinner from "../../components/Spinner";

const AdminDashboard = () => {
  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data =
          await getDashboardData();

        setDashboard(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="page-container">
      <h1>Admin Dashboard</h1>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2>
            {dashboard?.totalUsers || 0}
          </h2>

          <p>Total Users</p>
        </div>

        <div className="dashboard-card">
          <h2>
            {dashboard?.totalDoctors || 0}
          </h2>

          <p>Total Doctors</p>
        </div>

        <div className="dashboard-card">
          <h2>
            {dashboard?.totalAppointments ||
              0}
          </h2>

          <p>Total Appointments</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;