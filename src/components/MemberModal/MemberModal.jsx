import { useContext, useState } from "react";
import WorkasanaContext from "../../contexts/WorkasanaContext";

export default function MemberModal({ teamId, onClose }) {
  const { ownersData, addMemberToTeam } = useContext(WorkasanaContext);
  const [selectedMember, setSelectedMember] = useState("");

  const handleAddMember = async () => {
    if (!selectedMember) {
      alert("Please select a member to add.");
      return;
    }

    await addMemberToTeam(teamId, selectedMember);
    onClose();
  };

  return (
    <>
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-sm">
            <div className="modal-header text-white">
              <h5 className="modal-title fw-semibold">Add Member</h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Select Member</label>
                <select
                  className="form-select"
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                >
                  <option value="">-- Select a user --</option>
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
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddMember}>
                Add Member
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </>
  );
}
