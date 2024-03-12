import { AvatarGroup, Button, Card, CardActions, CardContent, Container, Divider, Paper, Stack, styled, useMediaQuery, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { useState, useEffect } from 'react';
import { ResponsiveContainer } from 'recharts';

import { renderRadarChart, renderRadialBarChart } from '../components/Charts';
import { getTrainings, ITraining, TrainingState, TrainingStateLabel } from '../services/Trainings';

import DlrLogo from "../static/img/DLR_Logo_EN_black.png";
import EcoSystem from "../static/img/ecosystem.drawio.png";
import React from "react";
import UserAvatar from "../components/UserAvatar";
import { IUser, userService } from "../services/User";
import { useNavigate } from "react-router-dom";


const Main = () => {
  const navigate = useNavigate();

  const [trainings, setTrainings] = useState<ITraining[]>([]);
  const [lastTraining, setLastTraining] = useState<ITraining>();
  const [participants, setParticipants] = useState<IUser[]>([]);

  useEffect(() => {
    getTrainings().then(setTrainings);
  }, [])

  useEffect(() => {
    if (!trainings) return;
    let sortedTrainings = trainings.sort((a,b) => new Date(a.lastUpdate) < new Date(b.lastUpdate) ? -1 : 1)
    setLastTraining(sortedTrainings.at(-1));
    if (!lastTraining) return;
    userService.getUsers(lastTraining.participants)
      .then((participants) => participants.sort((a, b) => a.username.localeCompare(b.username)))
      .then(setParticipants);
  }, [trainings, lastTraining]);

  const trainingCard = (
    <React.Fragment>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Training States
        </Typography>
        <Typography variant="body2" component="div">
          {trainings.filter(x => x.state===TrainingState.INITIAL).length} in state {TrainingStateLabel[TrainingState.INITIAL]}
        </Typography>
        <Typography variant="body2" component="div">
        {trainings.filter(x => x.state===TrainingState.ONGOING).length} in state {TrainingStateLabel[TrainingState.ONGOING]}
        </Typography>
        <Typography variant="body2" component="div">
        {trainings.filter(x => x.state===TrainingState.COMPLETED).length} in state {TrainingStateLabel[TrainingState.COMPLETED]}
        </Typography>
        <Typography variant="body2" component="div">
        {trainings.filter(x => x.state===TrainingState.ERROR).length} in state {TrainingStateLabel[TrainingState.ERROR]}
        </Typography>
        <Typography variant="body2" component="div">
        {trainings.filter(x => x.state===TrainingState.SWAG_ROUND).length} in state {TrainingStateLabel[TrainingState.SWAG_ROUND]}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate("/trainings")}>Learn More</Button>
        </CardActions>
    </React.Fragment>
  );


  const lastTrainingCard = (lastTraining: ITraining) => (
    <React.Fragment>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        Last Training
        </Typography>
        <Typography variant="body2" component="div">
        In state {TrainingStateLabel[lastTraining.state]}.
        </Typography>
        <Typography variant="body2" component="div">
        The aggregation method is {lastTraining.aggregationMethod}.
        </Typography>
        <Typography variant="body2" component="div">
        Uncertainty method is {lastTraining.uncertaintyMethod}.
        </Typography>
        <Typography variant="body2" component="div">
        Last updated {new Date(lastTraining.lastUpdate).toLocaleString()}.
        </Typography>
        <Typography variant="body2" component="div">
        Participants:
        </Typography>
        <AvatarGroup
          className="MultilineMuiAvatarGroup-root"
          sx={{ flexWrap: "wrap-reverse", justifyContent: "left" }}
          max={50}
        >
          {participants.map((participant: IUser) => (
            <UserAvatar user={participant} key={participant.id}></UserAvatar>
          ))}
        </AvatarGroup>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate("/training/" + lastTraining.id)}>Learn More</Button>
      </CardActions>
    </React.Fragment>
  );


  return (
    <Box>

      <Typography variant="h5">
      Training Summary
      </Typography>
      <Divider />

      {trainings &&
      <Stack direction={"row"} spacing={8} m={3}>
        <Card variant="outlined" sx={{ minWidth: 100 }}>{trainingCard}</Card>
        {lastTraining &&
        <Card variant="outlined">{lastTrainingCard(lastTraining)}</Card>}
      </Stack>}

      <Typography variant="h5">
      Architecture
      </Typography>
      <Divider />
      <Container sx={{ m: 2, mt: 4, mb: 4 }}>
        <Stack direction="row" justifyContent="center">
          <img src={EcoSystem} alt="ecosystem" style={{ maxWidth: "100%" }} />
        </Stack>
      </Container>

      <Typography variant="h5">
      Information
      </Typography>
      <Divider />
      <Container sx={{ m: 2, mt: 4, mb: 4 }}>
        <Typography>
          Federated learning (also known as collaborative learning) is a machine learning technique that trains an algorithm via multiple independent sessions, each using its own dataset. This approach stands in contrast to traditional centralized machine learning techniques where local datasets are merged into one training session, as well as to approaches that assume that local data samples are identically distributed.

          Federated learning enables multiple actors to build a common, robust machine learning model without sharing data, thus addressing critical issues such as data privacy, data security, data access rights and access to heterogeneous data. Its applications engage industries including defense, telecommunications, Internet of Things, and pharmaceuticals. A major open question is when/whether federated learning is preferable to pooled data learning. Another open question concerns the trustworthiness of the devices and the impact of malicious actors on the learned model.
        </Typography>
      </Container>

      <Divider />

      <Container sx={{ m: 2, mt: 4, mb: 4 }}>
        <Stack direction="row">
          <img src={DlrLogo} alt="Logo" width="280" />
        </Stack>
      </Container>
    </Box>
  );
};

export default Main;
