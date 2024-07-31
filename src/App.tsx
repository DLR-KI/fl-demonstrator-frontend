// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "./App.scss";

import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import AboutPage from "./pages/AboutPage";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import TrainingDetailsPage from "./pages/TrainingDetailsPage";
import TrainingsPage from "./pages/TrainingsPage";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00668e",
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#e0b02e",
      // dark: will be calculated from palette.secondary.main,
    },
  },
});

/**
 * The main App component that sets up the theme, the router and all the routes.
 *
 * @returns {JSX.Element} The rendered App component.
 */
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>

          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
          >

            <Route index element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
            />

            <Route path="trainings/" element={
              <PrivateRoute>
                <TrainingsPage />
              </PrivateRoute>
            }
            />

            <Route path="training/:trainingId" element={
              <PrivateRoute>
                <TrainingDetailsPage />
              </PrivateRoute>
            }
            />

            <Route path="about" element={
              <PrivateRoute>
                <AboutPage />
              </PrivateRoute>
            }
            />


            <Route path="admin/" element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
            />

            <Route path="profile/" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
            />
            {/*<Route path="inference/" element={
              <PrivateRoute>
                <InferencePage/>
              </PrivateRoute>
            }
          />*/}
            {/* <Route path="*" element={<NoPage />} /> */}

          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
