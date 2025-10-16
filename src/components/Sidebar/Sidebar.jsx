import { NavLink } from "react-router-dom";
import { useContext } from "react";
import WorkasanaContext from "../../contexts/WorkasanaContext";
import "./Sidebar.css";

export default function Sidebar() {
  const { token, logout, setCloseSideBar } = useContext(WorkasanaContext);

  return (
    <aside className="sidebar">
      <h3 className="brand">Workasana</h3>
      <nav className="">
        <NavLink to="/dashboard" className="nav-link" onClick={() => setCloseSideBar(false)}>
          <i className="bi bi-grid-1x2 me-2"></i>Dashboard
        </NavLink>
        <NavLink to="/projects" className="nav-link" onClick={() => setCloseSideBar(false)}>
          <i className="bi bi-grid-3x3-gap me-2"></i>Projects
        </NavLink>
        <NavLink to="/teams" className="nav-link" onClick={() => setCloseSideBar(false)}>
          <i className="bi bi-people me-2"></i>Teams
        </NavLink>
        <NavLink to="/reports" className="nav-link" onClick={() => setCloseSideBar(false)}>
         <i className="bi bi-bar-chart me-2"></i> Reports
        </NavLink>
        <NavLink to="/tasks" className="nav-link" onClick={() => setCloseSideBar(false)}>
          <i className="bi bi-person-workspace me-2"></i>Tasks
        </NavLink>
        {token && (
          <button className="nav-link logout-btn" onClick={logout}>
            <i className="bi bi-box-arrow-right me-2"></i>Log Out
          </button>
        )}
      </nav>
    </aside>
  );
}
