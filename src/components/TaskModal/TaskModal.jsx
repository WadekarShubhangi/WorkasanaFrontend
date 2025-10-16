import { useContext } from "react";
import WorkasanaContext from "../../contexts/WorkasanaContext";
import "./TaskModal.css"

export default function TaskModal({ onClose }) {
  const {
    addTask,
    taskHandleChange,
    createTask,
    projectData,
    teamData,
    ownersData,
  } = useContext(WorkasanaContext);

  return (
    <>
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-semibold">Create Task</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              <form>
                {/* Task Name */}
                <div className="mb-3">
                  <label className="form-label">Task Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Enter task name"
                    value={addTask.name || ""}
                    onChange={taskHandleChange}
                  />
                </div>

                {/* Project */}
                <div className="mb-3">
                  <label className="form-label">Project</label>
                  <select
                    className="form-select"
                    name="project"
                    value={addTask.project || ""}
                    onChange={taskHandleChange}
                  >
                    <option value="">Select Project</option>
                    {Array.isArray(projectData) &&
                      projectData.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Team */}
                <div className="mb-3">
                  <label className="form-label">Team</label>
                  <select
                    className="form-select"
                    name="team"
                    value={addTask.team || ""}
                    onChange={taskHandleChange}
                  >
                    <option value="">Select Team</option>
                    {Array.isArray(teamData) &&
                      teamData.map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Owners */}
                <div className="mb-3">
                  <label className="form-label">Owners</label>
                  <select
                    multiple
                    className="form-select"
                    name="owners"
                    value={addTask.owners || []}
                    onChange={(e) =>
                      taskHandleChange({
                        target: {
                          name: "owners",
                          value: Array.from(e.target.selectedOptions, (o) => o.value),
                        },
                      })
                    }
                  >
                    {Array.isArray(ownersData) &&
                      ownersData.map((o) => (
                        <option key={o._id} value={o._id}>
                          {o.name}
                        </option>
                      ))}
                  </select>
                  <div className="form-text">Hold Ctrl/Cmd to select multiple.</div>
                </div>

                {/* Tags */}
                <div className="mb-3">
                  <label className="form-label">Tags (comma separated)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tags"
                    placeholder="e.g. ui, testing"
                    value={Array.isArray(addTask.tags) ? addTask.tags.join(", ") : addTask.tags || ""}
                    onChange={taskHandleChange}
                  />
                </div>

                {/* Time to Complete */}
                <div className="mb-3">
                  <label className="form-label">Time to Complete (days)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="timeToComplete"
                    min="0"
                    step="0.5"
                    placeholder="Enter estimated days"
                    value={addTask.timeToComplete || ""}
                    onChange={taskHandleChange}
                  />
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={createTask}>
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </>
  );
}
