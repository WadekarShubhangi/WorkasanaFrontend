import { useContext, useState, useMemo } from "react";
import WorkasanaContext from "../../contexts/WorkasanaContext";
import { useNavigate } from "react-router-dom";
import ProjectModal from "../../components/ProjectModal/ProjectModal";
import "./Project.css";

export default function Projects() {
  const {
    projectData,
    showProjectModal,
    setShowProjectModal,
    ownersData,
    taskData,
    getProjectStatus
  } = useContext(WorkasanaContext);

  const navigate = useNavigate();

  const [sortOption, setSortOption] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");

  const filteredProjects = useMemo(() => {
    if (!Array.isArray(projectData) || projectData.length === 0) return [];

    let filtered = [...projectData];

    // --- Filter by Owner ---
    if (ownerFilter.trim()) {
      const ownerTasks = Array.isArray(taskData)
        ? taskData.filter((t) =>
            t.owners?.some(
              (o) => o.name.toLowerCase() === ownerFilter.toLowerCase()
            )
          )
        : [];

      const ownerProjectIds = ownerTasks.map((t) => t.project?._id);

      filtered = filtered.filter((p) => ownerProjectIds.includes(p._id));
    }

    // --- Sorting Logic ---
    if (sortOption === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOption === "low") {
      // Low → Medium → High
      const order = { low: 1, medium: 2, high: 3 };
      filtered.sort((a, b) => {
        const aTag = a.tags?.[0]?.toLowerCase() || "zzz"; // fallback for undefined
        const bTag = b.tags?.[0]?.toLowerCase() || "zzz";
        return (order[aTag] || 4) - (order[bTag] || 4);
      });
    } else if (sortOption === "high") {
      // High → Medium → Low
      const order = { high: 1, medium: 2, low: 3 };
      filtered.sort((a, b) => {
        const aTag = a.tags?.[0]?.toLowerCase() || "zzz";
        const bTag = b.tags?.[0]?.toLowerCase() || "zzz";
        return (order[aTag] || 4) - (order[bTag] || 4);
      });
    }
    return filtered;
  }, [projectData, taskData, ownerFilter, sortOption]);
  return (
    <>
      {showProjectModal && (
        <ProjectModal onClose={() => setShowProjectModal(false)} />
      )}

      <div className="projects-page container-fluid">
        <h2 className="fw-semibold mb-4">All Projects</h2>
        <div className="d-flex gap-2 align-items-center justify-content-between mb-4 flex-wrap">
          <div className="d-flex gap-2 flex-wrap">
            <select
              className="form-select form-select-sm w-auto"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="low">Low Priority</option>
              <option value="high">High Priority</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>

            {/* Filter by Owner */}
            <select
              className="form-select form-select-sm w-auto"
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
            >
              <option value="">Filter by Owner</option>
              {Array.isArray(ownersData) &&
                ownersData.map((o) => (
                  <option key={o._id} value={o.name}>
                    {o.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Add Button */}
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowProjectModal(true)}
          >
            <i className="bi bi-plus-lg me-1"></i> Add Project
          </button>
        </div>

        <div className="row g-3">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((proj) => (
              <div
                key={proj._id}
                className="col-md-4 d-flex"
                onClick={() => navigate(`/projects/${proj._id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="card project-card flex-fill shadow-sm">
                  <div className="card-body d-flex flex-column justify-content-between">
                    <span
                      className={`badge ${
                      getProjectStatus(proj.name) === "Completed"
                        ? "bg-success-subtle text-success"
                        : getProjectStatus(proj.name) === "In Progress"
                        ? "bg-warning-subtle text-warning"
                        : "bg-info-subtle text-info"
                    }`}
                    >
                      {getProjectStatus(proj.name)}
                    </span>
                    <div>
                      <h5 className="card-title fw-semibold text-primary mb-2">
                        {proj.name}
                      </h5>
                      <p className="text-muted small">
                        {proj.description || "No description provided."}
                      </p>
                      {proj.tags?.length > 0 && (
                        <span className="badge bg-secondary-subtle text-dark">
                          {proj.tags[0]}
                        </span>
                      )}
                    </div>
                    <div className="text-end">
                      <small className="text-secondary">
                        {new Date(proj.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </small>
                    </div>
                    
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted mt-4">
              No projects found. Try adding one!
            </p>
          )}
        </div>
      </div>
    </>
  );
}
