import { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState("login");
  const [authenticated, setAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );

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