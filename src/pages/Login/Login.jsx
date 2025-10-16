import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import WorkasanaContext from "../../contexts/WorkasanaContext";
import "./Login.css";

export default function Login() {
  const { loginUser } = useContext(WorkasanaContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(form, navigate);
  };

  return (
    <div className="auth-container d-flex justify-content-center align-items-center">
      <div className="login-box text-center shadow-lg p-4 bg-white rounded-3">
        <h4 className="brand-text mb-3 text-primary-color fw-bolder">Workasana</h4>
        <h5 className="fw-semibold mb-2">Log in to your account</h5>
        <p className="text-muted small mb-4">Please enter your details.</p>

        <form onSubmit={handleSubmit} className="text-start">
          <div className="mb-2">
            <label className="form-label fw-semibold">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter Your Email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="mb-3 position-relative">
            <label className="form-label fw-semibold">Password</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="btn btn-link position-absolute end-0 position-btn translate-middle-y me-2 text-muted p-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
            </button>
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-semibold">
            Login
          </button>
        </form>

        <p className="text-muted small mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary fw-semibold text-decoration-none">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
