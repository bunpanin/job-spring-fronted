import { useState } from "react";
import { registerCandidate } from "../api/authApi";

function Register({ goToLogin }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((old) => ({
      ...old,
      [e.target.name]: e.target.value,
    }));
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const data = await registerCandidate(form);

      setMessage(
        data.message ||
          "Register successful. Please check your email to verify account."
      );

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <h2>Register Candidate</h2>
      <p>Create your Job Spring candidate account.</p>

      {message && <div className="alert">{message}</div>}

      <form onSubmit={submitRegister}>
        <label>First Name</label>
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="Bun"
          required
        />

        <label>Last Name</label>
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Paninn"
          required
        />

        <label>Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="candidate@gmail.com"
          required
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />

        <button disabled={loading} type="submit">
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="switch-text">
        Already have account?{" "}
        <button type="button" className="link-btn" onClick={goToLogin}>
          Login
        </button>
      </p>
    </div>
  );
}

export default Register;