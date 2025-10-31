import { createContext, useState } from "react";
import useFetch from "../useFetch";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const WorkasanaContext = createContext();
export default WorkasanaContext;

export function WorkasanaProvider({ children }) {
  const [closeSideBar, setCloseSideBar] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("userToken") || null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [addProject, setAddProject] = useState({ name: "", description: "" });

  const [addTask, setAddTask] = useState({
    name: "",
    project: "",
    team: "",
    owners: [],
    tags: "",
    timeToComplete: "",
    status: "To Do",
  });

  const [addTeam, setAddTeam] = useState({
    name: "",
    description: "",
    members: [],
  });

  const API_BASE = "https://workasana-r99o.onrender.com";

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

  const signupUser = async (userData, navigate) => {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("Signup successful");
      navigate("/login");
    } else {
      toast.error(data.message || "Signup failed");
    }
  };

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
      toast.error("Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    setToken(null);
    window.location.reload();
  };

  const getRandomProjects = (count) => {
    if (!Array.isArray(projectData)) return [];
    const shuffled = [...projectData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const getRandomTasks = (count) => {
    if (!Array.isArray(taskData)) return [];
    const shuffled = [...taskData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const projectHandleChange = (e) => {
    setAddProject({ ...addProject, [e.target.name]: e.target.value });
  };

  const createProject = async () => {
    if (!addProject.name.trim()) {
      toast.success("Project Name is required.");
      return;
    }
    if (!token) {
      toast.error("Please log in to create a project.");
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
        toast.success("Project created successfully!");
        await refetchProjects();
        setShowProjectModal(false);
        setAddProject({ name: "", description: "" });
      } else {
        toast.error(data.message || "Failed to create project.");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("An error occurred. Check console for details.");
    }
  };

  const taskHandleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "tags") {
      newValue = value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);
    } else if (name === "timeToComplete") {
      newValue = value === "" ? "" : Number(value);
    }
    setAddTask((prev) => ({ ...prev, [name]: newValue }));
  };

  const createTask = async () => {
    if (
      !addTask.name.trim() ||
      !addTask.project ||
      !addTask.team ||
      addTask.owners.length === 0 ||
      !addTask.timeToComplete
    ) {
      toast.success(
        "Please fill all required fields (Name, Project, Team, Owners, Time to Complete)."
      );
      return;
    }
    if (!token) {
      toast.error("Please log in to create a task.");
      return;
    }

    const payload = {
      ...addTask,
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
        toast.success("Task created successfully!");
        await refetchTasks();
        setShowTaskModal(false);
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
        toast.error(data.message || "Failed to create task.");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("An unexpected error occurred while creating the task.");
    }
  };

  const teamHandleChange = (e) => {
    const { name, value } = e.target;
    setAddTeam((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createTeam = async () => {
    if (!addTeam.name.trim()) {
      toast.success("Team Name is required.");
      return;
    }

    if (!token) {
      toast.error("Please log in to create a team.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addTeam),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Team created successfully!");
        await refetchTeams();
        setShowTeamModal(false);
        setAddTeam({ name: "", description: "", members: [] }); // reset form
      } else {
        toast.error(data.message || "Failed to create team.");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("An error occurred. Check console for details.");
    }
  };

  const addMemberToTeam = async (teamId, userId) => {
    if (!teamId || !userId) {
      toast.error("Team ID and User ID are required.");
      return;
    }

    if (!token) {
      toast.error("Please log in first.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/teams/${teamId}/add-member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Member added successfully!");
        await refetchTeams();
      } else {
        toast.error(data.message || "Failed to add member.");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Something went wrong. Check console for details.");
    }
  }
  
  // ✅ Update Task Status Function
const updateTaskStatus = async (taskId, newStatus) => {
  if (!token) {
    toast.error("Please log in first.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Task status updated!");
      await refetchTasks();
    } else {
      toast.error(data.message || "Failed to update task.");
    }
  } catch (error) {
    console.error("Error updating task:", error);
    toast.error("An error occurred while updating task status.");
  }
};
;

  const getTasksByProject = () => {
    if (!Array.isArray(taskData)) return { labels: [], data: [] };
    const grouped = {};
    taskData.forEach((task) => {
      const projectName = task.project?.name || "Unassigned";
      grouped[projectName] = (grouped[projectName] || 0) + 1;
    });
    return { labels: Object.keys(grouped), data: Object.values(grouped) };
  };

  const getTasksByTeam = () => {
    if (!Array.isArray(taskData)) return { labels: [], data: [] };
    const grouped = {};
    taskData.forEach((task) => {
      const teamName = task.team?.name || "Unassigned";
      grouped[teamName] = (grouped[teamName] || 0) + 1;
    });
    return { labels: Object.keys(grouped), data: Object.values(grouped) };
  };

  const getTasksByStatus = () => {
    if (!Array.isArray(taskData)) return { labels: [], data: [] };
    const grouped = {};
    taskData.forEach((task) => {
      const status = task.status || "To Do";
      grouped[status] = (grouped[status] || 0) + 1;
    });
    return { labels: Object.keys(grouped), data: Object.values(grouped) };
  };

  const getTasksByOwner = () => {
    if (!Array.isArray(taskData)) return { labels: [], data: [] };
    const grouped = {};
    taskData.forEach((task) => {
      task.owners?.forEach((owner) => {
        grouped[owner.name] = (grouped[owner.name] || 0) + 1;
      });
    });
    return { labels: Object.keys(grouped), data: Object.values(grouped) };
  };

  const getProjectStatus = (name) => {
    const tasks = taskData.filter((task) => task.project.name === name);
    if (tasks.length == 0) {
      return "To Do";
    } else {
      const tasksStatus = tasks.filter((task) => task.status === "Completed");

      if (tasksStatus.length === tasks.length) {
        return "Completed";
      } else {
        return "In Progress";
      }
    }
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
        teamData,
        ownersData,
        refetchProjects,
        refetchTasks,
        getRandomProjects,
        getRandomTasks,
        addProject,
        projectHandleChange,
        createProject,
        addTask,
        taskHandleChange,
        createTask,
        teamData,
        showTeamModal,
        setShowTeamModal,
        addTeam,
        teamHandleChange,
        createTeam,
        addMemberToTeam,
        getTasksByProject,
        getTasksByStatus,
        getTasksByTeam,
        getTasksByOwner,
        getProjectStatus, updateTaskStatus,
      }} 
    >
            {children}   
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
      />
    </WorkasanaContext.Provider>
  );
}
