import { Button, Grid } from "@mui/material";
import Box from "@mui/material/Box";

import { useState, useEffect } from "react";

import Training from "../components/Training";
import { getTrainings, ITraining } from "../services/Trainings";
import React from "react";
import FormDialog from "../components/CreateTrainingFormDialog";
import { IUser, userService } from "../services/User";
import CreateTrainingFormDialog from "../components/CreateTrainingFormDialog";


const TrainingsPage = () => {
  const [trainings, setTrainings] = useState<ITraining[]>([]);

  useEffect(() => {
    getTrainings().then(setTrainings);
  }, []);

  return (
    <React.Fragment>
    <CreateTrainingFormDialog />

    <Box mt={5}>
      {trainings.length > 0 &&
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 4, md: 6 }}>
          {trainings.map((training: ITraining) => (
            <Grid item key={training.id}>
              <Training training={training} />
            </Grid>
          ))}
        </Grid>
      }
    </Box>
    </React.Fragment>
  );
};

export default TrainingsPage;
