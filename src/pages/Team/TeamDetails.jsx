import { Link, useParams } from "react-router-dom";
import { useContext , useState} from "react";
import WorkasanaContext from "../../contexts/WorkasanaContext";
import MemberModal from "../../components/MemberModal/MemberModal";
const TeamDetails = () => {
  const { id } = useParams();
  const { teamData } = useContext(WorkasanaContext);
const [showMemberModal, setShowMemberModal] = useState(false);
 
  const selectedTeam = Array.isArray(teamData)
    ? teamData.find((team) => team._id === id)
    : null;

  if (!selectedTeam) {
    return <p className="text-center my-5">Loading team details...</p>;
  }

  return (
    <>
     {showMemberModal && (
  <MemberModal
    teamId={selectedTeam._id}
    onClose={() => setShowMemberModal(false)}
  />
)}

      {/* Team Card */}
      <h2 className="fw-semibold mb-4">{selectedTeam.name}</h2>
      <div>
        <h6 className="text-secondary mb-3 fw-semibold">Members</h6>

        <ul className="list-unstyled">
          {selectedTeam.members && selectedTeam.members.length > 0 ? (
            selectedTeam.members.map((member) => (
              <li key={member._id} className="d-flex align-items-center mb-2">
                {/* Circle avatar with initial */}
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                  style={{
                    width: "25px",
                    height: "25px",
                    fontWeight: "400",
                    fontSize: "14px",
                  }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>

                {/* Member name */}
                <span className="fw-normal text-dark">{member.name}</span>
              </li>
            ))
          ) : (
            <li className="text-muted">No members assigned to this team.</li>
          )}
        </ul>

       <button
  className="btn btn-primary mt-3"
  onClick={() => setShowMemberModal(true)}
>
  <i className="bi bi-plus-lg me-1"></i> Add Member
</button>

      </div>
      {/* </div> */}
    </>
  );
};

export default TeamDetails;
