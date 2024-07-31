// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import BarChartIcon from "@mui/icons-material/BarChart";
import DownloadIcon from '@mui/icons-material/Download';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography
} from "@mui/material";
import Tab from '@mui/material/Tab';
import saveAs from "file-saver";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Metrics from "../components/Metrics";
import ParticipantsMap from '../components/ParticipantsMap';
import { getMetric, IMetric } from "../services/Metric";
import { getModelFile, getModelMetadata, IModel } from "../services/Models";
import { deleteTraining, getTraining, ITraining, startTraining, TrainingState, TrainingStateLabel } from "../services/Trainings";
import { fetchLocations, getUser, getUsers, IParticipantLocations, IUser } from "../services/User";

const TrainingDetailsPage = () => {
  const navigate = useNavigate();
  const { trainingId } = useParams();
  const [metrics, setMetrics] = useState<IMetric[]>([]);
  const [training, setTraining] = useState<ITraining>();
  const [locations, setLocations] = useState<IParticipantLocations>();
  const [participants, setParticipants] = useState<IUser[]>([]);
  const [model, setModel] = useState<IModel>();
  const [tabValue, setTabValue] = useState("1");
  const [open, setOpen] = useState(false);
  const [actor, setActor] = useState<IUser>();
  const [modelOwner, setModelOwner] = useState<IUser>();


  const fetchData = useCallback(async () => {
    if (!training) return;

    const metricsPromise = getMetric(training.model);
    const usersPromise = getUsers(training.participants).then(users => users.sort((a, b) => a.username.localeCompare(b.username)));
    const modelMetadataPromise = getModelMetadata(training.model);

    const [metrics, users, model] = await Promise.all([metricsPromise, usersPromise, modelMetadataPromise]);

    setMetrics(metrics);
    setParticipants(users);
    setModel(model);
    fetchLocations(users).then(setLocations);
    getUser(training.actor).then(setActor)
    getUser(model.owner).then(setModelOwner)
  }, [training]);

  useEffect(() => {
    if (!trainingId) return;
    getTraining(trainingId).then(setTraining);
  }, [trainingId]);

  useEffect(() => {
    fetchData();
  }, [fetchData, tabValue]);

  useEffect(() => {
    if (!training) return;

    const interval = setInterval(() => {
      getMetric(training.model).then(setMetrics);
    }, 10000); // 10000 milliseconds = 10 seconds

    return () => clearInterval(interval);
  }, [training]);

  const handleDelete = async (id: string) => {
    await deleteTraining(id);
    fetchData();
    handleClose();
    navigate(-1); // Navigate to the previous page
  };

  const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    setTabValue(newValue);
  };

  const downloadModel = () => {
    if (!model) return;
    getModelFile(model.id).then((x) => saveAs(x, "model.pickle"));
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!training || !model) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Fragment>
      <Card elevation={0} sx={{ minWidth: 200, minHeight: 800 }}>
        <CardHeader
          title={"Training for the " + model.name}
          subheader={"Last Update: " + new Date(training.lastUpdate).toLocaleString()}
          avatar={<BarChartIcon />}
        />
        <CardContent>
          <Box m={1} sx={{ position: 'relative' }}>
            <TabContext value={tabValue} >
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }} >
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="Overview" value="1" />
                  <Tab label="Metrics" value="2" />
                  <Tab label="Model" value="3" />
                  <Tab label="Inference" value="4" />
                  <Tab label="Map" value="5" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <Container>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        Training Details
                      </Typography>
                      <Grid container spacing={2} marginTop={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            <strong>ID:</strong> {training.id}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            <strong>Actor:</strong> <Chip
                              label={`${actor?.firstName} ${actor?.lastName}`}
                              style={{ marginRight: '5px', marginBottom: '5px' }}
                            />
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            <strong>Model:</strong> {model.name}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            <strong>State:</strong> {TrainingStateLabel[training.state]}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            <strong>Target Number of Updates:</strong> {training.targetNumUpdates}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            <strong>Uncertainty Method:</strong> {training.uncertaintyMethod}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            <strong>Aggregation Method:</strong> {training.aggregationMethod}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            <strong>Locked:</strong> {training.locked ? 'Yes' : 'No'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2">
                            <strong>Last Update:</strong> {new Date(training.lastUpdate).toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="h6" component="div">
                            Participants
                          </Typography>
                          {participants.map((participant) => (
                            <Chip
                              key={participant.id}
                              label={`${participant.firstName} ${participant.lastName}`}
                              style={{ marginRight: '5px', marginBottom: '5px' }}
                            />
                          ))}
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions>
                      {(training?.state === TrainingState.INITIAL) && trainingId && (
                        <Button
                          variant="contained"
                          onClick={async () => { await startTraining(trainingId); fetchData(); }}
                          sx={{ m: 1, mr: 2 }}
                        >
                          Start Training
                        </Button>
                      )}
                      <Button onClick={handleClickOpen} variant="contained" color="error" sx={{ m: 1 }}
                      >
                        Delete Training
                      </Button>
                    </CardActions>
                  </Card>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete this training?
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose} color="primary">
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleDelete(training.id)}
                        color="error"
                        autoFocus
                      >
                        Delete
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Container>
              </TabPanel>
              <TabPanel value="2">
                {metrics.length === 0 && <Typography>No Metrics available yet.</Typography>}

                {metrics.length > 0 && <Metrics metrics={metrics} training={training} participants={participants} />}
              </TabPanel>
              <TabPanel value="3">
                <Container>
                  <Card>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {model.name || 'Unnamed Model'}
                      </Typography>
                      <Typography color="text.secondary">
                        {model.description || 'No description available'}
                      </Typography>
                      <Grid container spacing={2} marginTop={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            <strong>ID:</strong> {model.id}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            <strong>Owner:</strong> <Chip
                              label={`${modelOwner?.firstName} ${modelOwner?.lastName}`}
                              style={{ marginRight: '5px', marginBottom: '5px' }}
                            />
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body2">
                            <strong>Round:</strong> {model.round}
                          </Typography>
                        </Grid>
                      </Grid>

                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        startIcon={<DownloadIcon />}
                        onClick={downloadModel}
                        sx={{ m: 1 }}
                      >
                        Download Model
                      </Button>
                    </CardActions>
                  </Card>
                </Container>
              </TabPanel>
              <TabPanel value="4">
                <Typography>This feature will soon be available. Stay tuned!</Typography>
                {/* <InferenceContainer model={model}></InferenceContainer> */}
              </TabPanel>
              <TabPanel value="5">
                {locations && <ParticipantsMap participants={participants} locations={locations}></ParticipantsMap>}
              </TabPanel>
            </TabContext>
          </Box>
        </CardContent>
      </Card>
      <Box sx={{ position: 'fixed', bottom: 0, bgcolor: 'background.paper', p: 1 }}>
        <Container>
          <Button variant="contained" fullWidth onClick={() => navigate("/trainings")}>
            Back
          </Button>
        </Container>
      </Box>
    </Fragment>
  );
};

export default TrainingDetailsPage;
