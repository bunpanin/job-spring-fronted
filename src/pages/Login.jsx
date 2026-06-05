import { useState } from "react";
import { loginCandidate } from "../api/authApi";

function Login({ goToRegister, onLoginSuccess }) {
  const [form, setForm] = useState({
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

  const submitLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await loginCandidate(form.email, form.password);
      onLoginSuccess();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loginWithKeycloak = () => {
    window.location.href =
      "http://localhost:8080/realms/job-spring/protocol/openid-connect/auth?client_id=job-spring-frontend&redirect_uri=http://localhost:5173/auth/callback&response_type=code&scope=openid";
  };

  const loginWithGoogle = () => {
  const url =
    "http://localhost:8080/realms/job-spring/protocol/openid-connect/auth" +
    "?client_id=job-spring-frontend" +
    "&redirect_uri=http://localhost:5174/auth/callback" +
    "&response_type=code" +
    "&scope=openid%20email%20profile" +
    "&kc_idp_hint=google";

  window.location.href = url;
};

  return (
    <div className="auth-card">
      <h2>Login Candidate</h2>
      <p>Login using your email and password.</p>

      {message && <div className="alert error">{message}</div>}

      <form onSubmit={submitLogin}>
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <button type="button" className="secondary-btn" onClick={loginWithGoogle}>
        Continue with Google
      </button>

      <p className="switch-text">
        No account?{" "}
        <button type="button" className="link-btn" onClick={goToRegister}>
          Register
        </button>
      </p>
    </div>
  );
}

export default Login;