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
  } = useContext(WorkasanaContext);

  const [query, setQuery] = useState("");
const filteredProjects = projectData?.filter((p) =>
  p.name.toLowerCase().includes(query.toLowerCase())
);
const filteredTasks = taskData?.filter((t) =>
  t.name.toLowerCase().includes(query.toLowerCase())
);


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
            <h3>Projects</h3>
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
            {(filteredProjects?.length
              ? filteredProjects
              : getRandomProjects(3)
            ).map((proj) => (
              <div key={proj._id} className="col-md-4 mb-3 d-flex">
                <div className="card card-elevated flex-fill">
                  <div className="card-body">
                    <span className="badge bg-info-subtle text-info">
                      Active
                    </span>
                    <h5 className="card-title mt-2">{proj.name}</h5>
                    <p className="text-muted">{proj.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="section-block">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Tasks</h3>
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
            {/* {(query ? filteredTasks : getRandomTasks(3)).map((item) => ( */}
            {(filteredTasks?.length ? filteredTasks : getRandomTasks(3)).map(
              (task) => (
                <div key={task._id} className="col-md-4 mb-3 d-flex">
                  <div className="card card-elevated flex-fill">
                    <div className="card-body">
                      <span
                        className={`badge bg-${
                          task.status === "Completed" ? "success" : "warning"
                        }-subtle text-${
                          task.status === "Completed" ? "success" : "warning"
                        }`}
                      >
                        {task.status}
                      </span>
                      <h5 className="card-title mt-2">{task.name}</h5>
                      <p className="text-muted">{task.description}</p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </>
  );
}
