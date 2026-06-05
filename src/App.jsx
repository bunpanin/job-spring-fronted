import { useEffect, useState } from "react";
import keycloak from "./auth/keycloak";
import Home from "./pages/Home";
import Profile from "./pages/Profile";

function App() {
  const [authenticated, setAuthenticated] = useState(keycloak.authenticated);
  const [token, setToken] = useState(keycloak.token);

  useEffect(() => {
    const interval = setInterval(() => {
      if (keycloak.authenticated) {
        keycloak
          .updateToken(30)
          .then((refreshed) => {
            if (refreshed) {
              setToken(keycloak.token);
              console.log("Token refreshed");
            }
          })
          .catch(() => {
            console.log("Token refresh failed");
            keycloak.logout();
          });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const login = () => {
    keycloak.login({
      redirectUri: "http://localhost:5173",
    });
  };

  const register = () => {
    keycloak.register({
      redirectUri: "http://localhost:5173",
    });
  };

  const logout = () => {
    keycloak.logout({
      redirectUri: "http://localhost:5173",
    });
  };

  return (
    <div className="container">
      <h1>Job Spring Frontend Test</h1>

      {!authenticated ? (
        <Home login={login} register={register} />
      ) : (
        <Profile
          logout={logout}
          token={token}
          setAuthenticated={setAuthenticated}
        />
      )}
    </div>
  );
}

export default App;