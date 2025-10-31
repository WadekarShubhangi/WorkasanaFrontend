import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import WorkasanaContext from "./contexts/WorkasanaContext";
import Sidebar from "./components/Sidebar/Sidebar";
import "./App.css";
import Logo from "./assets/Logo.png";

export default function App() {
  const { token, closeSideBar, setCloseSideBar } = useContext(WorkasanaContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token && location.pathname !== "/signup") {
      navigate("/login");
    } else if (token && location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [token, location.pathname, navigate]);

  return (
    <div className="layout">
      {token && (
        <aside className={`sidebar-wrapper ${closeSideBar ? "open" : ""}`}>
          <Sidebar />
        </aside>
      )}

      <div className="my-3 d-flex justify-content-between align-items-center mobile-view-nav">
        {token && (
          <button
            className="toggle-btn"
            onClick={() => setCloseSideBar(!closeSideBar)}
          >
            {closeSideBar ? (
              <i className="bi bi-x-lg"></i>
            ) : (
              <i className="bi bi-list"></i>
            )}
          </button>
        )}
        <img
          className="d-block logo d-md-none"
          height={40}
          width={50}
          src={Logo}
          alt="Workasana logo"
        />
      </div>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
