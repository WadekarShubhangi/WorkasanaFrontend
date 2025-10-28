import { useContext } from "react";
import WorkasanaContext from "../../contexts/WorkasanaContext";
import "./TeamModal.css";

export default function TeamModal({ onClose }) {
  const { addTeam, teamHandleChange, createTeam, ownersData } =
    useContext(WorkasanaContext);

  // 🧩 Custom handler for multiple member selection
  const handleMemberSelect = (e) => {
    const selectedMembers = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );

    teamHandleChange({
      target: { name: "members", value: selectedMembers },
    });
  };

  return (
    <>
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content shadow-sm border-0">
            {/* === Header === */}
            <div className="modal-header">
              <h5 className="modal-title fw-semibold">Create Team</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>

            {/* === Body === */}
            <div className="modal-body">
              <form>
                {/* Team Name */}
                <div className="mb-3">
                  <label className="form-label">Team Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    placeholder="Enter team name"
                    value={addTeam?.name || ""}
                    onChange={teamHandleChange}
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    placeholder="Enter short description"
                    value={addTeam?.description || ""}
                    onChange={teamHandleChange}
                  ></textarea>
                </div>

                {/* Members (Multiple Selection) */}
                <div className="mb-3">
                  <label className="form-label">Add Members</label>
                  <select
                    multiple
                    className="form-select"
                    name="members"
                    value={addTeam.members || []}
                    onChange={handleMemberSelect}
                  >
                    {Array.isArray(ownersData) && ownersData.length > 0 ? (
                      ownersData.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No users available</option>
                    )}
                  </select>
                  <div className="form-text">
                    Hold <strong>Ctrl</strong> (Windows) or <strong>Cmd</strong>{" "}
                    (Mac) to select multiple members.
                  </div>
                </div>
              </form>
            </div>

            {/* === Footer === */}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={createTeam}>
                Create
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </>
  );
}
