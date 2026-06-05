const KEYCLOAK_TOKEN_URL = "http://localhost:8080/realms/job-spring/protocol/openid-connect/token";

const BACKEND_URL = "http://localhost:9090";

export async function loginCandidate(email, password) {
  const body = new URLSearchParams();

  body.append("client_id", "job-spring-frontend");
  body.append("grant_type", "password");
  body.append("username", email);
  body.append("password", password);

  const response = await fetch(KEYCLOAK_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || "Login failed");
  }

  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);

  return data;
}

export async function registerCandidate(payload) {
  let response;

  try {
    response = await fetch(`${BACKEND_URL}/api/auth/register-candidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error(
      "Cannot connect to backend. Check Spring Boot port 9090 and CORS."
    );
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data.message || `Register failed: ${response.status}`);
  }

  return data;
}

export async function getMyProfile() {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${BACKEND_URL}/api/candidates/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Cannot load profile");
  }

  return response.json();
}

export async function logoutCandidate() {
  const refreshToken = localStorage.getItem("refresh_token");

  if (refreshToken) {
    const body = new URLSearchParams();
    body.append("client_id", "job-spring-frontend");
    body.append("refresh_token", refreshToken);

    await fetch(
      "http://localhost:8080/realms/job-spring/protocol/openid-connect/logout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
      }
    );
  }

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}