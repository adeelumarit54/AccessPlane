import React, { useState } from "react";
import {
  Button,
  Input,
  Spinner,
  makeStyles,
  Text,
  Card,
  CardHeader,
} from "@fluentui/react-components";
import { storeTokens } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f2f1",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    gap: "15px",
  },
  errorMessage: {
    color: "red",
    fontSize: "14px",
  },
  successMessage: {
    color: "green",
    fontSize: "14px",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "30px",
  },
   logo: {
    maxWidth: "120px",
    height: "auto",
  },

  brandText: {
    fontSize: "24px",
    fontWeight: "600",
    marginLeft: "5px",
  }
});

const Login: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      const urlencoded = new URLSearchParams();
      urlencoded.append("grant_type", "password");
      urlencoded.append("username", username);
      urlencoded.append("password", password);

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: urlencoded,
      };

      const response = await fetch(
        "https://outlookdemo.accessplanit.com/accessplansandbox/api/v2/token",
        requestOptions
      );
      const result = await response.json();

      if (response.ok && result.access_token) {
        storeTokens(result);
        console.log("Access Token:", result.access_token);
        setSuccessMessage("Login successful!");
 window.localStorage.setItem("access_token",result.access_token);

        navigate("/home");
      } else {
        throw new Error(result.error || "Login failed");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card} style={{gap:"25px"}}>
        <CardHeader
        style={{
          display:"flex",
          justifyContent: "center"
            }}
          
        />
         <div className={styles.logoContainer}>
              <img
                className={styles.logo}
                src="/assets/AccessPlan.png"
                alt="Company Logo"
                style={{ width: "100px", height: "auto",maxWidth:"40px" }}
              />
                        <Text className={styles.brandText}>AccessPlan</Text>
              
            </div>
        {errorMessage && <Text className={styles.errorMessage}>{errorMessage}</Text>}
        {successMessage && <Text className={styles.successMessage}>{successMessage}</Text>}
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          appearance="primary"
          onClick={handleLogin}
          disabled={loading || !username || !password}
        >
          Login
        </Button>
        {loading && <Spinner label="Logging in..." />}
      </Card>
    </div>
  );
};

export default Login;
