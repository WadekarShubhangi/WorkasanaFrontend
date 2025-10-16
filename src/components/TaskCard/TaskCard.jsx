import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Removed: import './TaskCard.css'; to resolve compilation error

/**
 * Maps task status to appropriate Tailwind/Bootstrap-like color classes
 * for visual indicators (border color, badge color).
 * @param {string} status - The task status (e.g., 'Completed', 'In Progress').
 * @returns {string} Tailwind/Bootstrap-like color name.
 */
const getStatusColor = (status) => {
    switch (status) {
        case 'Completed':
            return 'success';
        case 'In Progress':
            return 'primary';
        case 'Blocked':
            return 'danger';
        case 'To Do':
        default:
            return 'secondary';
    }
};

/**
 * Displays key details of a single task in a compact, clickable card format.
 * The card uses populated data (project, team, owners) from the API response.
 * @param {object} props
 * @param {object} props.task - The task object, expected to have populated fields.
 */
export default function TaskCard({ task }) {
    if (!task || !task._id) return null;

    const [isHovered, setIsHovered] = useState(false);

    const statusColor = getStatusColor(task.status);
    const ownerName = task.owners?.[0]?.name || 'Unassigned';
    const projectName = task.project?.name || 'N/A';
    const timeRemaining = task.timeToComplete || 'N/A';
    const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A';

    // Inline style equivalent to TaskCard.css (for hover effect)
    const cardStyles = {
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 4px 12px rgba(0, 0, 0, 0.1)' : '0 1px 3px rgba(0, 0, 0, 0.07)',
        borderRadius: '0.5rem',
    };
    
    // Wrapper style ensures the card takes full height of the column
    const wrapperStyle = {
        height: '100%', 
        display: 'block'
    };

    return (
        <div 
            className="task-card-wrapper h-100" 
            style={wrapperStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Link wraps the entire card to navigate to the detailed view */}
            <Link to={`/tasks/${task._id}`} className="text-decoration-none d-block h-100">
                <div 
                    className={`card shadow-sm h-100 border-start border-3 border-${statusColor}`}
                    style={cardStyles}
                >
                    <div className="card-body d-flex flex-column">
                        
                        {/* Status Badge */}
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className={`badge bg-${statusColor}-subtle text-${statusColor} fw-semibold`}>
                                {task.status}
                            </span>
                            <i className="bi bi-three-dots-vertical text-muted"></i>
                        </div>

                        {/* Task Title - bold and truncated */}
                        <h5 className="card-title fw-bold text-truncate" title={task.name}>
                            {task.name}
                        </h5>
                        
                        {/* Project and Team Context */}
                        <div className="small text-muted mb-3">
                            <i className="bi bi-folder me-1"></i> {projectName}
                            <span className="mx-2">|</span>
                            <i className="bi bi-people me-1"></i> {task.team?.name || 'No Team'}
                        </div>

                        {/* Owner and Due Details at the bottom */}
                        <div className="mt-auto pt-2 border-top">
                            <div className="d-flex justify-content-between small text-dark mb-1">
                                <span>
                                    <i className="bi bi-person-circle me-1"></i>
                                    Owner: **{ownerName}**
                                </span>
                            </div>
                            <div className="d-flex justify-content-between small text-dark">
                                <span>
                                    <i className="bi bi-calendar-check me-1"></i>
                                    Due: **{dueDate}**
                                </span>
                                <span>
                                    <i className="bi bi-clock me-1"></i>
                                    Time Left: **{timeRemaining} days**
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
