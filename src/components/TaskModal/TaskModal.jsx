import { useContext } from "react";
import WorkasanaContext from "../../contexts/WorkasanaContext";

export default function TaskModal({ onClose }) {
 
    const {
  addTask = {},
  createTask,
  taskHandleChange,
  projectData,
  teamData,
  ownersData,
} = useContext(WorkasanaContext);



  return (
    <>
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Task</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Task Name"
                name="name"
                value={addTask.name}
                onChange={taskHandleChange}
              />
              <select
                name="project"
                className="form-select mb-2"
                value={addTask.project}
                onChange={taskHandleChange}
              >
                <option value="">Select Project</option>
                {projectData?.map((proj) => (
                  <option key={proj._id} value={proj._id}>
                    {proj.name}
                  </option>
                ))}
              </select>
              <select
                name="team"
                className="form-select mb-2"
                value={addTask.team}
                onChange={taskHandleChange}
              >
                <option value="">Select Team</option>
                {teamData?.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="timeToComplete"
                placeholder="Time to complete (days)"
                className="form-control"
                value={addTask.timeToComplete}
                onChange={taskHandleChange}
              />
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
