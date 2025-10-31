import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState, useMemo } from "react";
import WorkasanaContext from "../../contexts/WorkasanaContext";
import TaskModal from "../../components/TaskModal/TaskModal"
import "./Project.css";

export default function ProjectDetails() {
  const { id: projectId } = useParams();
  const { projectData, taskData, setShowTaskModal, showTaskModal } =
    useContext(WorkasanaContext);

    const navigate = useNavigate()

  const [ownerFilter, setOwnerFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // ✅ Get selected project
  const project = Array.isArray(projectData)
    ? projectData.find((p) => p._id === projectId)
    : null;

  // ✅ Get tasks for this project
  const projectTasks = useMemo(() => {
    if (!Array.isArray(taskData)) return [];

    let filtered = taskData.filter((task) => task.project?._id === projectId);

    // Apply owner filter
    if (ownerFilter) {
      filtered = filtered.filter((task) =>
        task.owners?.some((o) =>
          o.name.toLowerCase().includes(ownerFilter.toLowerCase())
        )
      );
    }

    // Apply tag filter
    if (tagFilter) {
      filtered = filtered.filter((task) =>
        task.tags?.some((t) =>
          t.toLowerCase().includes(tagFilter.toLowerCase())
        )
      );
    }

    // Apply date filter (createdAt)
    if (dateFilter) {
      console.log("date", dateFilter, "filtered", filtered, filtered[0].createdAt.slice(0, 10));
      filtered = filtered.filter(
        (task) => task.createdAt.slice(0, 10) === dateFilter
      );
    }

    return filtered;
  }, [taskData, projectId, ownerFilter, tagFilter, dateFilter]);

  // ✅ Utility: calculate due date
  const getDueDate = (task) => {
    if (!task.createdAt || !task.timeToComplete) return "—";
    const created = new Date(task.createdAt);
    const due = new Date(
      created.getTime() + task.timeToComplete * 24 * 60 * 60 * 1000
    );
    return due.toLocaleDateString();
  };

  return (
    <>
      {showTaskModal && <TaskModal onClose={() => setShowTaskModal(false)} />}

      <div className="container-fluid">
        
        {project ? (
          <>
            {/* === Project Header === */}
            <div className="mb-4">
              <h3 className="fw-semibold">{project.name}</h3>
              <p className="text-muted">{project.description}</p>
            </div>

            {/* === Filters === */}
            <div className="d-flex justify-content-between">
              <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
                <input
                  type="text"
                  className="form-control form-control-sm w-auto"
                  placeholder="Filter by owner"
                  value={ownerFilter}
                  onChange={(e) => setOwnerFilter(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control form-control-sm w-auto"
                  placeholder="Filter by tag"
                  value={tagFilter}
                  onChange={(e) => setTagFilter(e.target.value)}
                />
                <input
                  type="date"
                  className="form-control form-control-sm w-auto"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>

              <div>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowTaskModal(true)}
                >
                  <i className="bi bi-plus-lg me-1"></i> Add Task
                </button>
              </div>
            </div>

         
            <div className="table-responsive">
              <table className="table table-bordered align-middle text-center">
                <thead className="table-primary">
                  <tr>
                    <th scope="col">Task</th>
                    <th scope="col">Owners</th>
                    <th scope="col">Tags</th>
                    <th scope="col">Created</th>
                    <th scope="col">Due Date</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {projectTasks.length > 0 ? (
                    projectTasks.map((task) => (
                      <tr key={task._id} onClick={() => navigate(`/tasks/${task._id}`)} className="cursor-pointer">
                        <td className="fw-medium text-start">{task.name}</td>

                        {/* === Owners === */}
                        <td>
                          <div className="d-flex justify-content-center align-items-center gap-1">
                            {task.owners?.slice(0, 3).map((o, i) => (
                              <div
                                key={i}
                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                }}
                                title={o.name}
                              >
                                {o.name[0].toUpperCase()}
                              </div>
                            ))}
                            {task.owners?.length > 3 && (
                              <div
                                className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                }}
                              >
                                +{task.owners.length - 3}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* === Tags === */}
                        <td>
                          {Array.isArray(task.tags) && task.tags.length > 0 ? (
                            task.tags.map((tag, i) => (
                              <span
                                key={i}
                                className="badge bg-secondary text-white me-1"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-muted small">—</span>
                          )}
                        </td>

                        {/* === Dates === */}
                        <td>{new Date(task.createdAt).toLocaleDateString()}</td>
                        <td>{getDueDate(task)}</td>

                        {/* === Status === */}
                        <td>
                          <span
                            className={`badge ${
                              task.status === "Completed"
                                ? "bg-success"
                                : task.status === "In Progress"
                                ? "bg-warning text-dark"
                                : "bg-info text-dark"
                            }`}
                          >
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-3">
                        No tasks found for this project.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-center text-muted mt-5">
            Project not found or still loading...
          </p>
        )}
      </div>
    </>
  );
}
