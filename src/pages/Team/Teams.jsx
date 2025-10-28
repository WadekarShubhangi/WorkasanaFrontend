import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import WorkasanaContext from "../../contexts/WorkasanaContext";
import TeamModal from "../../components/TeamModal/TeamModal";
import "./Teams.css";

export default function Teams() {
  const { teamData, taskData, showTeamModal, setShowTeamModal } =
    useContext(WorkasanaContext);
  const navigate = useNavigate();

  if (!Array.isArray(teamData)) {
    return <p className="text-center my-5">Loading Teams...</p>;
  }

  // ✅ Get unique members per team from tasks
  const getTeamMembers = (teamId) => {
    if (!Array.isArray(taskData)) return [];

    const membersFromTasks = taskData
      .filter((task) => task.team?._id === teamId)
      .flatMap((task) => task.owners || []);

    // Remove duplicates
    const uniqueMembers = [];
    const seen = new Set();

    for (const member of membersFromTasks) {
      if (member && !seen.has(member._id)) {
        uniqueMembers.push(member);
        seen.add(member._id);
      }
    }

    return uniqueMembers;
  };

  return (
    <>
      {/* === Modal === */}
      {showTeamModal && <TeamModal onClose={() => setShowTeamModal(false)} />}

      <div className="container-fluid">
        {/* === Header === */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <h2 className="fw-semibold mb-2 mb-md-0">All Teams</h2>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowTeamModal(true)}
          >
            <i className="bi bi-plus-lg me-1"></i> New Team
          </button>
        </div>

        {/* === Team Cards === */}
        <div className="row g-3">
          {teamData.length > 0 ? (
            teamData.map((team) => {
              const members = getTeamMembers(team._id);

              return (
                <div
                  key={team._id}
                  className="col-lg-4 col-md-6 d-flex"
                  onClick={() => navigate(`/teams/${team._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="card flex-fill shadow-sm border-0 team-card h-100">
                    <div className="card-body d-flex flex-column justify-content-between">
                      <div>
                        <h5 className="card-title fw-semibold text-primary mb-2">
                          {team.name}
                        </h5>
                        <p className="text-muted small mb-3">
                          {team.description || "No description provided."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-muted mt-4">
              No teams found. Try adding one!
            </p>
          )}
        </div>
      </div>
    </>
  );
}
