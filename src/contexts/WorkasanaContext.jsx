import { createContext, useState } from "react";
import useFetch from "../useFetch";

const WorkasanaContext = createContext();
export default WorkasanaContext;

export function WorkasanaProvider({ children }) {
  const [closeSideBar, setCloseSideBar] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("userToken") || null);
    const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [addProject, setAddProject] = useState({ name: "", description: "" });
const [addTask, setAddTask] = useState({
  name: "",
  project: "",
  team: "",
  owners: [],
  tags: [],
  timeToComplete: "",
  status: "To Do",
});



  const API_BASE = "https://workasana-zeta.vercel.app";

 const { data: projectData, refetch: refetchProjects } = useFetch(
    token ? `${API_BASE}/projects` : null,
    token ? { headers: { Authorization: `Bearer ${token}` } } : {}
  );

  const { data: taskData, refetch: refetchTasks } = useFetch(
    token ? `${API_BASE}/tasks` : null,
    token ? { headers: { Authorization: `Bearer ${token}` } } : {}
  );

  // Signup
  const signupUser = async (userData, navigate) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    console.log("Signup response:", data);
    if (res.ok) {
      alert("Signup successful");
      navigate("/login");
    } else {
      alert(data.message || "Signup failed");
    }
  };

  // Login
  const loginUser = async (credentials, navigate) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("userToken", data.token);
      setToken(data.token);
      navigate("/dashboard");
    } else {
      alert("Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    setToken(null);
    window.location.reload();
  };

  const getRandomProjects = (count) => {
    if (!projectData) return [];
    const shuffled = [...projectData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const getRandomTasks = (count) => {
    if (!taskData) return [];
    const shuffled = [...taskData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  return (
    <WorkasanaContext.Provider
      value={{
        
        logout,
        signupUser,
        loginUser,
        closeSideBar,
        setCloseSideBar,
        token,
        setToken,
        showProjectModal,
        setShowProjectModal,
        showTaskModal,
        setShowTaskModal,
        projectData,
        taskData,
        refetchProjects,
        refetchTasks,
        getRandomProjects,
        getRandomTasks,
      }}
    >
      {children}
    </WorkasanaContext.Provider>
  );
}
