import React, { useContext, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import WorkasanaContext from "../../contexts/WorkasanaContext";
import TaskCard from "../../components/TaskCard/TaskCard"; // Assuming you will create a TaskCard component

export default function ProjectDetail() {
    const { id: projectId } = useParams();
    const { 
        projectData, 
        taskData, 
        // We can reuse the modal logic if we want to add a task from here
        setShowTaskModal, 
        showTaskModal 
    } = useContext(WorkasanaContext);

    // 1. Find the specific project details
    const project = useMemo(() => {
        return projectData?.find(p => p._id === projectId);
    }, [projectData, projectId]);

    // 2. Filter tasks relevant to this project ID
    const projectTasks = useMemo(() => {
        return taskData?.filter(t => t.project?._id === projectId || t.project === projectId);
    }, [taskData, projectId]);
    
    // Calculate basic statistics
    const totalTasks = projectTasks?.length || 0;
    const completedTasks = projectTasks?.filter(t => t.status === "Completed").length || 0;
    const pendingTasks = totalTasks - completedTasks;

    // Handle loading or not found state
    if (!projectData || !taskData) {
        return <div className="text-center my-5">Loading project details...</div>;
    }

    if (!project) {
        return (
            <div className="alert alert-danger text-center my-5" role="alert">
                Project not found.
                <Link to="/projects" className="ms-2">Go back to Projects</Link>
            </div>
        );
    }

    return (
        <div className="project-detail-container">
            {showTaskModal && (
                // Assuming TaskModal can take a defaultProject prop
                <TaskModal 
                    onClose={() => setShowTaskModal(false)} 
                    defaultProject={projectId}
                />
            )}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <Link to="/projects" className="btn btn-link p-0 mb-2 text-decoration-none">
                        <i className="bi bi-arrow-left me-1"></i> Back to Projects
                    </Link>
                    <h1 className="fw-bold">{project.name}</h1>
                    <p className="text-muted">{project.description}</p>
                </div>
                <div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowTaskModal(true)}
                    >
                        <i className="bi bi-plus-lg me-1"></i> Add Task
                    </button>
                    {/* Placeholder for Edit/Delete buttons */}
                </div>
            </div>
            
            <hr />

            {/* Project Status/Stats Card Block */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card text-center h-100 p-3 shadow-sm border-0">
                        <h5 className="text-primary">Total Tasks</h5>
                        <p className="display-4 fw-bold">{totalTasks}</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center h-100 p-3 shadow-sm border-0">
                        <h5 className="text-success">Completed</h5>
                        <p className="display-4 fw-bold">{completedTasks}</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center h-100 p-3 shadow-sm border-0">
                        <h5 className="text-warning">Pending</h5>
                        <p className="display-4 fw-bold">{pendingTasks}</p>
                    </div>
                </div>
            </div>

            {/* Task List Section */}
            <h3>Tasks for this Project ({projectTasks?.length})</h3>
            <div className="row mt-4">
                {projectTasks?.length > 0 ? (
                    projectTasks.map((task) => (
                        // Replace the div with your actual TaskCard component when ready
                        <div key={task._id} className="col-lg-4 col-md-6 mb-4">
                            <div className={`card shadow-sm border-start border-3 
                                ${task.status === "Completed" ? "border-success" : 
                                 task.status === "In Progress" ? "border-primary" : "border-secondary"}`}>
                                <div className="card-body">
                                    <h5 className="card-title">{task.name}</h5>
                                    <p className="small text-muted mb-1">Status: **{task.status}**</p>
                                    <p className="small text-muted mb-1">Team: {task.team?.name || 'N/A'}</p>
                                    <p className="small text-muted mb-0">Owner: {task.owners?.[0]?.name || 'Unassigned'}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <div className="alert alert-secondary text-center" role="alert">
                            No tasks have been assigned to this project yet.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}