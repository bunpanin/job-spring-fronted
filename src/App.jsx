import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AuthCallback from "./pages/AuthCallback";

function App() {
  const [page, setPage] = useState("login");
  const [authenticated, setAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );

  const path = window.location.pathname;

  if (path === "/auth/callback") {
    return (
      <div className="page">
        <AuthCallback onLoginSuccess={() => {
          setAuthenticated(true);
          window.history.replaceState({}, "", "/");
        }} />
      </div>
    );
  }

  if (authenticated) {
    return (
      <div className="page">
        <Dashboard onLogout={() => setAuthenticated(false)} />
      </div>
    );
  }

  return (
    <div className="page">
      {page === "login" && (
        <Login
          goToRegister={() => setPage("register")}
          onLoginSuccess={() => setAuthenticated(true)}
        />
      )}

      {page === "register" && (
        <Register goToLogin={() => setPage("login")} />
      )}
    </div>
  );
}

export default App;