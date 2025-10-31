import { useContext } from "react";
import WorkasanaContext from "../../contexts/WorkasanaContext";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Reports.css";
import { Link } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function Reports() {
  const {
    getTasksByProject,
    getTasksByTeam,
    getTasksByStatus,
    getTasksByOwner,
  } = useContext(WorkasanaContext);

  const projectData = getTasksByProject();
  const teamData = getTasksByTeam();
  const statusData = getTasksByStatus();
  const ownerData = getTasksByOwner();

  return (
    <div className="container-fluid reports-page">
        <h3 className="fw-semibold">Workasana Reports</h3>
      <div className="report-section">
        <div className="card report-card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="card-title fw-semibold text-primary mb-3">
              Total Work Done Last Week
            </h5>
            {projectData.data.length > 0 ? (
              <Bar
                data={{
                  labels: projectData.labels,
                  datasets: [
                    {
                      label: "Tasks Completed",
                      data: projectData.data,
                      backgroundColor: "rgba(54, 162, 235, 0.6)",
                      borderColor: "rgba(54, 162, 235, 1)",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            ) : (
              <p className="text-muted small text-center">
                No data available for last week.
              </p>
            )}
          </div>
        </div>

    
        <div className="card report-card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="card-title fw-semibold text-primary mb-3">
              Total Days of Work Pending
            </h5>
            {statusData.data.length > 0 ? (
              <Line
                data={{
                  labels: statusData.labels,
                  datasets: [
                    {
                      label: "Pending Tasks",
                      data: statusData.data,
                      fill: false,
                      borderColor: "rgba(255, 99, 132, 0.8)",
                      tension: 0.3,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            ) : (
              <p className="text-muted small text-center">
                No pending work data found.
              </p>
            )}
          </div>
        </div>

      
        <div className="card report-card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="card-title fw-semibold text-primary mb-3">
              Tasks Closed by Team
            </h5>
            {teamData.data.length > 0 ? (
              <Doughnut
                data={{
                  labels: teamData.labels,
                  datasets: [
                    {
                      label: "Closed Tasks",
                      data: teamData.data,
                      backgroundColor: [
                        "rgba(75, 192, 192, 0.6)",
                        "rgba(255, 206, 86, 0.6)",
                        "rgba(153, 102, 255, 0.6)",
                        "rgba(255, 159, 64, 0.6)",
                      ],
                      borderColor: [
                        "rgba(75, 192, 192, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(153, 102, 255, 1)",
                        "rgba(255, 159, 64, 1)",
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: "bottom" } },
                }}
              />
            ) : (
              <p className="text-muted small text-center">
                No team data available.
              </p>
            )}
          </div>
        </div>

    
        <div className="card report-card shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title fw-semibold text-primary mb-3">
              Tasks Closed by Owner
            </h5>
            {ownerData.data.length > 0 ? (
              <Bar
                data={{
                  labels: ownerData.labels,
                  datasets: [
                    {
                      label: "Closed Tasks",
                      data: ownerData.data,
                      backgroundColor: "rgba(153, 102, 255, 0.6)",
                      borderColor: "rgba(153, 102, 255, 1)",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: "#555",
                        font: { size: 12 },
                      },
                    },
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 1 },
                    },
                  },
                }}
              />
            ) : (
              <p className="text-muted small text-center">
                No owner-based data available.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
