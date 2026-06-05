import { useEffect, useState } from "react";
import { exchangeCodeForToken } from "../api/authApi";

function AuthCallback({ onLoginSuccess }) {
  const [message, setMessage] = useState("Processing login...");

  useEffect(() => {
    const processLogin = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (!code) {
          setMessage("Login failed. Authorization code not found.");
          return;
        }

        await exchangeCodeForToken(code);

        setMessage("Login successful.");

        onLoginSuccess();
      } catch (error) {
        setMessage(error.message);
      }
    };

    processLogin();
  }, [onLoginSuccess]);

  return (
    <div className="auth-card">
      <h2>Google Login</h2>
      <p>{message}</p>
    </div>
  );
}

export default AuthCallback;