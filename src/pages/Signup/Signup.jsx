import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import WorkasanaContext from "../../contexts/WorkasanaContext";
import "./Signup.css"

export default function Signup() {
  const { signupUser } = useContext(WorkasanaContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    signupUser(form, navigate);
  };

  return (
    <div className="auth-container d-flex justify-content-center align-items-center">
      <div className="login-box text-center shadow-lg p-4 bg-white rounded-3">
        <h4 className="brand-text mb-3 text-primary-color fw-bolder">Workasana</h4>
        <h5 className="fw-semibold mb-2">Create an account</h5>
        <p className="text-muted small mb-3">Get started with project management.</p>

        <form onSubmit={handleSubmit} className="text-start">
          <div className="mb-2">
            <label className="form-label fw-semibold">Name</label>
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2">
            <label className="form-label fw-semibold">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Email address"
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
            Signup
          </button>
        </form>

        <p className="text-muted small mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary fw-semibold text-decoration-none">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
