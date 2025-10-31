import { useContext, useState } from "react";
import SearchBox from "../../components/SearchBox/SearchBox";
import ProjectModal from "../../components/ProjectModal/ProjectModal";
import TaskModal from "../../components/TaskModal/TaskModal";
import WorkasanaContext from "../../contexts/WorkasanaContext";
import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const {
    projectData,
    taskData,
    showProjectModal,
    setShowProjectModal,
    showTaskModal,
    setShowTaskModal,
    getRandomProjects,
    getRandomTasks,
    getProjectStatus
  } = useContext(WorkasanaContext);

  const [query, setQuery] = useState("");

  // Check if there is a non-empty search query
  const hasQuery = query.trim().length > 0;

  // 1. Calculate Filtered Projects
  const filteredProjects = Array.isArray(projectData)
    ? projectData.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // 2. Calculate Filtered Tasks
  const filteredTasks = Array.isArray(taskData)
    ? taskData.filter((t) => t.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  // 3. Determine which list to display: filter (if query) or random 3 (if no query)
  const projectsToDisplay = hasQuery ? filteredProjects : getRandomProjects(3);
  const tasksToDisplay = hasQuery ? filteredTasks : getRandomTasks(3);

  // --- Utility Function for direct JSX use ---
  // This function is still the cleanest way to handle multiple status conditions in a single line.
  const getColorClass = (status) => {
    return status === "Completed"
      ? "success"
      : status === "Blocked"
      ? "danger"
      : status === "In Progress"
      ? "warning"
      : "info"; // Default to 'info' for "To Do" or unknown status
  };

  return (
    <>
      {showProjectModal && (
        <ProjectModal onClose={() => setShowProjectModal(false)} />
      )}
      {showTaskModal && <TaskModal onClose={() => setShowTaskModal(false)} />}

      <div className="dashboard-container">
        <SearchBox query={query} setQuery={setQuery} />
        <section className="section-block">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fw-semibold mb-2 mb-md-0">Projects</h2>
            <div>
              <Link
                to="/projects"
                className="btn btn-link text-decoration-none"
              >
                See all <i className="bi bi-arrow-right-short"></i>
              </Link>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowProjectModal(true)} 
              >
                <i className="bi bi-plus-lg me-1"></i> Add Project
              </button>
            </div>
          </div>
          <div className="row">
            {projectsToDisplay.map((proj) => (
              <div key={proj._id} className="col-md-4 mb-3 d-flex">
                <div className="card card-elevated flex-fill">
                  <div className="card-body">
                    <span
                      className={`badge bg-${getColorClass(getProjectStatus(proj.name))}-subtle text-${getColorClass(getProjectStatus(proj.name))}`}
                    >
                      {getProjectStatus(proj.name)}
                    </span>
                    <h5 className="card-title mt-2">{proj.name}</h5>
                    <p className="text-muted">{proj.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- TASKS SECTION --- */}
        <section className="section-block">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fw-semibold mb-2 mb-md-0">Tasks</h2>
            <div>
              <Link to="/tasks" className="btn btn-link text-decoration-none">
                See all <i className="bi bi-arrow-right-short"></i>
              </Link>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowTaskModal(true)}
              >
                <i className="bi bi-plus-lg me-1"></i> Add Task
              </button>
            </div>
          </div>
          <div className="row">
            {/* Map the dynamically selected list */}
            {tasksToDisplay.map((task) => (
              <div key={task._id} className="col-md-4 mb-3 d-flex">
                <div className="card card-elevated flex-fill">
                  <div className="card-body">
                    {/* DIRECT CONDITIONAL LOGIC APPLIED HERE */}
                    <span
                      className={`badge bg-${getColorClass(task.status)}-subtle text-${getColorClass(task.status)}`}
                    >
                      {task.status}
                    </span>
                    <h5 className="card-title mt-2">{task.name}</h5>
                    <p className="text-muted">{task.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}