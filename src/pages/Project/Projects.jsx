import React, { useContext } from "react";
// Correcting path assumption: The Project page is under src/pages/Project, 
// so we need to go up two levels to reach src/.
// From src/pages/Project to src/contexts/WorkasanaContext is: ../../contexts/WorkasanaContext
import WorkasanaContext from "../../contexts/WorkasanaContext"; 
import ProjectModal from "../../components/ProjectModal/ProjectModal";
import { Link } from "react-router-dom"; 
// import "./Projects.css"; 

export default function Projects() {
    const { 
        projectData, 
        showProjectModal, 
        setShowProjectModal
    } = useContext(WorkasanaContext);

    // Determine loading state based on whether projectData is fetched
    const isLoading = projectData === undefined; 

    return (
        <>
            {showProjectModal && (
                <ProjectModal onClose={() => setShowProjectModal(false)} />
            )}

            <div className="projects-container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2>Projects</h2>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowProjectModal(true)}
                    >
                        <i className="bi bi-plus-lg me-1"></i> Add New Project
                    </button>
                </div>

                {isLoading ? (
                    // Display loading spinner while data is being fetched
                    <div className="text-center my-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="row">
                        {projectData?.length > 0 ? (
                            projectData.map((proj) => (
                                <div key={proj._id} className="col-lg-4 col-md-6 mb-4 d-flex">
                                    {/* Link wraps the entire card to navigate to the Project Detail Page */}
                                    <Link 
                                        to={`/projects/${proj._id}`} 
                                        className="text-decoration-none flex-fill"
                                        style={{ color: 'inherit' }} // Keep text color default
                                    >
                                        <div className="card card-elevated flex-fill h-100 shadow-sm transition-shadow">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <h5 className="card-title fw-bold mb-3">{proj.name}</h5>
                                                    {/* Placeholder for future action menu */}
                                                    <i className="bi bi-three-dots text-muted cursor-pointer"></i>
                                                </div>
                                                
                                                {/* Projects don't have status in model, using a generic badge */}
                                                <span className="badge bg-info-subtle text-info mb-2">
                                                    Active
                                                </span>

                                                <p className="card-text text-muted small mt-2">
                                                    {proj.description || "No description provided."}
                                                </p>

                                                <hr className="my-2"/>
                                                <div className="d-flex justify-content-between small text-muted">
                                                    <span>Created: {new Date(proj.createdAt).toLocaleDateString()}</span>
                                                    {/* Placeholder for Task Count */}
                                                    <span>Tasks: 0</span> 
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="col-12">
                                <div className="alert alert-info text-center" role="alert">
                                    No projects found. Click "Add New Project" to get started!
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
