// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Alert, Stack } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../services/User";
import DlrLogo from "../static/img/DLR_Signet_black.png";


function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://www.dlr.de/en">
        Deutsches Zentrum für Luft- und Raumfahrt e.V.
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

/**
 * This function represents the login page component in the application.
 * It handles the user login process by taking the user's credentials (username and password),
 * and then it calls the login function with these credentials.
 * If the credentials are correct, it navigates to the main page ("/").
 * If the credentials are incorrect, it sets the 'wrongCredentialsEntered' state to true, and navigates back to the login page.
 *
 * @returns {JSX.Element} Returns a JSX element that represents the login page.
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const [wrongCredentialsEntered, setWrongCredentialsEntered] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = String(data.get("username"));
    const password = String(data.get("password"));
    let response = await login(username, password);
    if (response.status < 300) {
      localStorage.setItem("user", JSON.stringify({ "username": username, "password": password }));
      navigate("/");
    }
    else {
      setWrongCredentialsEntered(true);
      navigate("/login");
    }
  };

  return (
    <Container component="main" maxWidth="xs">

      <Stack direction="row" mt={3}>
        <img src={DlrLogo} alt="Logo" width="100" />
        <Typography component="h1" variant="h5" ml={5}>
          Federated Learning Demonstrator
        </Typography>
      </Stack>

      <Box
        display="flex"
        sx={{
          marginTop: 5,
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        {wrongCredentialsEntered &&
          <Alert severity="error" sx={{ mt: 3, mb: 2 }}>
            You have entered a wrong username or password!
          </Alert>
        }
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>

      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
};

export default LoginPage;
