// src/pages/Tasks/Tasks.jsx
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import WorkasanaContext from "../../contexts/WorkasanaContext";
import TaskModal from "../../components/TaskModal/TaskModal";
import "./Tasks.css";

export default function Tasks() {
  const { taskData, showTaskModal, setShowTaskModal,updateTaskStatus } = useContext(WorkasanaContext);
  const navigate = useNavigate();

  if (!Array.isArray(taskData)) {
    return <p className="text-center my-5">Loading tasks...</p>;
  }

  return (
    <div className="container-fluid">
      {showTaskModal && <TaskModal onClose={() => setShowTaskModal(false)} />}
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h3 className="fw-semibold mb-2 mb-md-0">All Tasks</h3>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowTaskModal(true)} 
        >
          <i className="bi bi-plus-lg me-1"></i> New Task
        </button>
      </div>

      {/* Task Cards */}
      <div className="row g-3">
        {taskData.length > 0 ? (
          taskData.map((task) => (
            <div
              key={task._id}
              className="col-xl-3 col-lg-4 col-md-6"
              onClick={() => navigate(`/tasks/${task._id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="card task-card shadow-sm border-0 h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="card-title fw-semibold text-primary">
                      {task.name}
                    </h5>
                    <p className="text-muted small mb-2">
                      Project:{" "}
                      <span className="fw-semibold text-dark">
                        {task.project?.name || "—"}
                      </span>
                    </p>
                    <p className="text-muted small mb-2">
                      Team:{" "}
                      <span className="fw-semibold text-dark">
                        {task.team?.name || "—"}
                      </span>
                    </p>
                    <p className="text-muted small mb-3">
                      Created:{" "}
                      {new Date(task.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Owners */}
                  <div className="d-flex align-items-center gap-2 mb-3">
                    {task.owners?.length > 0 ? (
                      task.owners.slice(0, 3).map((owner, i) => (
                        <div
                          key={i}
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                          style={{
                            width: "32px",
                            height: "32px",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}
                          title={owner.name}
                        >
                          {owner.name[0].toUpperCase()}
                        </div>
                      ))
                    ) : (
                      <span className="text-muted small">No owners</span>
                    )}
                  </div>

                  {/* Status */}
 <div className="d-flex justify-content-between align-items-center">
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

  <button
    className="btn btn-sm btn-outline-primary"
    onClick={(e) => {
      e.stopPropagation(); // prevent card click navigation
      const nextStatus =
        task.status === "To Do"
          ? "In Progress"
          : task.status === "In Progress"
          ? "Completed"
          : "To Do";
      updateTaskStatus(task._id, nextStatus);
    }}
  >
    Update
  </button>
</div>

                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted mt-4">
            No tasks found. Try adding one!
          </p>
        )}
      </div>
    </div>
  );
}
