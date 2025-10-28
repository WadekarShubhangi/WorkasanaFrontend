import { useContext } from "react";
import WorkasanaContext from "../../contexts/WorkasanaContext";

export default function ProjectModal({ onClose }) {
  const { addProject, createProject, projectHandleChange } = useContext(WorkasanaContext);


  return (
    <>
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Project</h5>
              <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Project Name"
                name="name"
                value={addProject.name}
                onChange={projectHandleChange}
              />
              <textarea
                className="form-control"
                rows="3"
                placeholder="Description"
                name="description"
                value={addProject.description}
                onChange={projectHandleChange}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={createProject}>
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
