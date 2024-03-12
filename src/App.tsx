import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import "./App.scss";

import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import ProfilePage from "./pages/ProfilePage";
import ModelsPage from "./pages/ModelsPage";
import TrainingsPage from "./pages/TrainingsPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import TrainingDetailsPage from "./pages/TrainingDetailsPage";

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

            <Route path="models/" element={
              <PrivateRoute>
                <ModelsPage />
              </PrivateRoute>
            }
            />

            {/* TODO: ParticipantsPage is still hard coded */}
            {/* <Route path="participants/" element={
              <PrivateRoute>
                <ParticipantsPage />
              </PrivateRoute>
            }
            /> */}

            <Route path="profile/" element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
            />

            {/* <Route path="*" element={<NoPage />} /> */}

          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
