import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "job-spring",
  clientId: "job-spring-frontend",
});

export default keycloak;