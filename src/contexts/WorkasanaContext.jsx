import { createContext, useState } from "react";
import useFetch from "../useFetch"; // Assuming useFetch hook is in a relative path

const WorkasanaContext = createContext();
export default WorkasanaContext;

export function WorkasanaProvider({ children }) {
  const [closeSideBar, setCloseSideBar] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("userToken") || null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [addProject, setAddProject] = useState({ name: "", description: "" }); // Initial state for Task based on Mongoose Schema

  const [addTask, setAddTask] = useState({
    name: "",
    project: "", // ObjectId
    team: "", // ObjectId
    owners: [], // Array of ObjectIds
    tags: "", // We initialize as string for modal input, convert to Array in handler
    timeToComplete: "", // Number
    status: "To Do", // Default status
  });

  const API_BASE = "https://workasana-zeta.vercel.app";

// ✅ Corrected safe fetch calls

const { data: projectData, refetch: refetchProjects } = useFetch(
  token ? `${API_BASE}/projects` : null,
  token ? { headers: { Authorization: `Bearer ${token}` } } : {}
);

const { data: taskData, refetch: refetchTasks } = useFetch(
  token ? `${API_BASE}/tasks` : null,
  token ? { headers: { Authorization: `Bearer ${token}` } } : {}
);

const { data: teamData, refetch: refetchTeams } = useFetch(
  token ? `${API_BASE}/teams` : null,
  token ? { headers: { Authorization: `Bearer ${token}` } } : {}
);

const { data: ownersData, refetch: refetchOwners } = useFetch(
  token ? `${API_BASE}/auth/users` : null,
  token ? { headers: { Authorization: `Bearer ${token}` } } : {}
);

  // --- Auth Functions --- // Signup

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
  }; // Login

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
  }; // --- Utility Functions ---

  const getRandomProjects = (count) => {
    if (!Array.isArray(projectData)) return [];
    const shuffled = [...projectData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const getRandomTasks = (count) => {
    if (!Array.isArray(taskData)) return [];
    const shuffled = [...taskData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }; // --- Project Logic ---

  const projectHandleChange = (e) => {
    setAddProject({ ...addProject, [e.target.name]: e.target.value });
  };

  const createProject = async () => {
    if (!addProject.name.trim()) {
      alert("Project Name is required.");
      return;
    }
    if (!token) {
      alert("Please log in to create a project.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addProject),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Project created successfully!");
        await refetchProjects();
        setShowProjectModal(false);
        setAddProject({ name: "", description: "" });
      } else {
        alert(data.message || "Failed to create project.");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("An error occurred. Check console for details.");
    }
  }; // --- Task Logic (NEW) ---

  const taskHandleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value; // Special handling for tags (string to array conversion)

    if (name === "tags") {
      newValue = value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    } // Handling for timeToComplete (ensure it's a number, even if empty)
    else if (name === "timeToComplete") {
      newValue = value === "" ? "" : Number(value);
    }
    // Note: 'owners' is handled by a custom function in TaskModal, which passes the array value directly.

    setAddTask((prev) => ({ ...prev, [name]: newValue }));
  };

  const createTask = async () => {
    // Basic validation based on required schema fields
    if (
      !addTask.name.trim() ||
      !addTask.project ||
      !addTask.team ||
      addTask.owners.length === 0 ||
      !addTask.timeToComplete
    ) {
      alert(
        "Please fill all required fields (Name, Project, Team, Owners, Time to Complete)."
      );
      return;
    }
    if (!token) {
      alert("Please log in to create a task.");
      return;
    }

    // Prepare payload (ensure timeToComplete is a number for the API)
    const payload = {
      ...addTask,
      // Ensure tags is an array, even if it was just an empty string
      tags: Array.isArray(addTask.tags)
        ? addTask.tags
        : addTask.tags
        ? addTask.tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0)
        : [],
      timeToComplete: Number(addTask.timeToComplete),
    };

    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Task created successfully!");
        await refetchTasks(); // Refresh the task list
        setShowTaskModal(false); // Close the modal
        // Reset the form state
        setAddTask({
          name: "",
          project: "",
          team: "",
          owners: [],
          tags: "",
          timeToComplete: "",
          status: "To Do",
        });
      } else {
        alert(data.message || "Failed to create task.");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      alert("An unexpected error occurred while creating the task.");
    }
  };

  return (
    <WorkasanaContext.Provider
      value={{
        // Auth & Sidebar
        logout,
        signupUser,
        loginUser,
        closeSideBar,
        setCloseSideBar,
        token,
        setToken, // Modal States

        showProjectModal,
        setShowProjectModal,
        showTaskModal,
        setShowTaskModal, // Data

        projectData,
        taskData,
        teamData, // NEW
        ownersData, // NEW
        refetchProjects,
        refetchTasks,
        getRandomProjects,
        getRandomTasks, // Project Management

        addProject,
        projectHandleChange,
        createProject,

        // Task Management (NEW)
        addTask,
        taskHandleChange,
        createTask,
      }}
    >
            {children}   {" "}
    </WorkasanaContext.Provider>
  );
}
