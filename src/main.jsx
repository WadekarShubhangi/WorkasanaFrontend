import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { WorkasanaProvider } from "./contexts/WorkasanaContext";
import ProjectDetails from "./pages/Project/ProjectDetails";
import TeamDetails from "./pages/Team/TeamDetails";
import App from "./App";

import Dashboard from "./pages/Dashboard/Dashboard";
import Projects from "./pages/Project/Projects";
import Teams from "./pages/Team/Teams";
import Reports from "./pages/Report/Reports";
import Tasks from "./pages/Task/Tasks";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import TaskDetails from "./pages/Task/TaskDetails";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <WorkasanaProvider>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="teams" element={<Teams />} />
          <Route path="reports" element={<Reports />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="teams/:id" element={<TeamDetails />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
        </Route>
      </Routes>
    </WorkasanaProvider>
  </BrowserRouter>
);
