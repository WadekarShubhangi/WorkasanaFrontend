// src/pages/TaskDetails/TaskDetails.jsx
import { useParams, Link } from "react-router-dom";
import { useContext } from "react";
import WorkasanaContext from "../../contexts/WorkasanaContext";
import "./TaskDetails.css";

export default function TaskDetails() {
  const { id } = useParams();
  const { taskData } = useContext(WorkasanaContext);

  const task = Array.isArray(taskData)
    ? taskData.find((t) => t._id === id)
    : null;

  if (!task) {
    return <p className="text-center my-5">Loading task details...</p>;
  }

  const getDueDate = (task) => {
    if (!task.createdAt || !task.timeToComplete) return "—";
    const created = new Date(task.createdAt);
    const due = new Date(
      created.getTime() + task.timeToComplete * 24 * 60 * 60 * 1000
    );
    return due.toLocaleDateString();
  };

  return (
    <div className="container">
      <div className="card task-detail-card shadow-sm border-0 mx-auto">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">{task.name}</h5>
        </div>

        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Project:</strong> {task.project?.name || "—"}
            </div>
            <div className="col-md-6">
              <strong>Team:</strong> {task.team?.name || "—"}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Status:</strong>{" "}
              <span
                className={`badge ${
                  task.status === "Completed"
                    ? "bg-success-subtle text-success"
                    : task.status === "In Progress"
                    ? "bg-warning-subtle text-warning"
                    : "bg-info-subtle text-info"
                }`}
              >
                {task.status}
              </span>
            </div>
            <div className="col-md-6">
              <strong>Created:</strong>{" "}
              {new Date(task.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="mb-3">
            <strong>Tags:</strong>{" "}
            {task.tags?.length ? (
              task.tags.map((tag, i) => (
                <span
                  key={i}
                  className="badge bg-secondary-subtle text-dark me-1"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-muted">No tags</span>
            )}
          </div>

          <div className="mb-3">
            <strong>Owners:</strong>
            <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
              {task.owners?.length ? (
                task.owners.map((owner, i) => (
                  <div
                    key={i}
                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                    style={{
                      width: "36px",
                      height: "36px",
                      fontSize: "15px",
                      fontWeight: "600",
                    }}
                    title={owner.name}
                  >
                    {owner.name[0].toUpperCase()}
                  </div>
                ))
              ) : (
                <span className="text-muted">No owners assigned</span>
              )}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <strong>Due Date:</strong> {getDueDate(task)}
            </div>
            <div className="col-md-6">
              <strong>Time to Complete:</strong>{" "}
              {task.timeToComplete || "—"} days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
