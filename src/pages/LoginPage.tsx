import { Alert, Stack } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { userService } from "../services/User";
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


const LoginPage = () => {
  const navigate = useNavigate();
  const [wrongCredentialsEntered, setWrongCredentialsEntered] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = String(data.get("username"));
    const password = String(data.get("password"));
    await userService.login(username, password);
    if (!userService.getCredentials()) {
      setWrongCredentialsEntered(true);
      navigate("/login");
    }
    else {
      navigate("/");
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
        sx={{
          marginTop: 5,
          display: "flex",
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
          {wrongCredentialsEntered && <Alert severity="error">You have entered a wrong username or password!</Alert>}
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          {/* <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid> */}
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
};

export default LoginPage;
