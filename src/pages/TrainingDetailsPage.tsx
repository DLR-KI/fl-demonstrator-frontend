import { AvatarGroup, Button, Divider, Grid, Stack } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Fragment, isValidElement, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Metrics from "../components/Metrics";
import ResponsiveTwoColumnGrid from "../components/ResponsiveTwoColumnGrid";
import { TrainingStatusIcon } from "../components/Training";
import UserAvatar from "../components/UserAvatar";
import { getMetric, IMetric } from "../services/Metric";
import { getModel } from "../services/Models";
import { getTraining, ITraining, startTraining, TrainingState } from "../services/Trainings";
import { getUser, IUser, userService } from "../services/User";


const NOT_SET_LINE = "—";

const TrainingDetailsPage = () => {
  const theme = useTheme();
  const isMediumUpScreenWidth = useMediaQuery(theme.breakpoints.up("md"));

  const { trainingId } = useParams();
  const [metrics, setMetrics] = useState<IMetric[]>([]);
  const [training, setTraining] = useState<ITraining>();
  const [participants, setParticipants] = useState<IUser[]>([]);
  const [actor, setActor] = useState<IUser | undefined>();
  const [modelName, setModelName] = useState<string>("");

  useEffect(() => {
    if (!trainingId) return;
    getTraining(trainingId).then(setTraining);
  }, [trainingId]);
  useEffect(() => {
    if (!training) return;
    getMetric(training.model).then(setMetrics);
    userService.getUsers(training.participants)
      .then((participants) => participants.sort((a, b) => a.username.localeCompare(b.username)))
      .then(setParticipants);
    getModel(training.model).then((model) => setModelName(model.name ?? model.id));
    getUser(training.actor).then(setActor);
  }, [training]);

  const createTableData = (training: ITraining | undefined, participants: IUser[]) => {
    if (!training || participants.length < 1) return [];

    const createData = (name: string, value?: any) => ({ name, value: isValidElement(value) ? value : String(value) });
    return [
      createData("ID", training.id),
      createData(
        "Actor",
        actor
          ? <UserAvatar user={actor} sx={isMediumUpScreenWidth ? { float: "right" } : {}}></UserAvatar>
          : undefined
      ),
      createData(
        "Participants",
        <AvatarGroup
          className="MultilineMuiAvatarGroup-root"
          sx={{ flexWrap: "wrap-reverse", justifyContent: isMediumUpScreenWidth ? "right" : "left" }}
          max={50}
        >
          {participants.map((participant: IUser) => (
            <UserAvatar user={participant} key={participant.id}></UserAvatar>
          ))}
        </AvatarGroup>
      ),
      createData("Model", modelName),
      createData("State", <TrainingStatusIcon state={training.state} sx={{ verticalAlign: "bottom" }} />),
      createData("Target Num Updates", training.targetNumUpdates),
      createData("Uncertainty Method", training.uncertaintyMethod === "NONE" ? NOT_SET_LINE : training.uncertaintyMethod),
      createData("Aggregation Method", training.aggregationMethod),
      createData("Locked", training.locked),
      createData("Last Update", new Date(training.lastUpdate).toLocaleString()),
    ];
  };

  return (
    <>
    {
      trainingId && (training?.state === TrainingState.INITIAL) &&
        <Button variant="contained" onClick={() => startTraining(trainingId)}>
          Start Training
        </Button>
    }

    <Stack spacing={4}>

        <ResponsiveTwoColumnGrid>
          {createTableData(training, participants).map((row: { name: string; value: string | JSX.Element; }, index: number) => (
            <Fragment key={index}>
              <Grid item xs={12} md={4}>{row.name}</Grid>
              <Grid item xs={12} md={8} sx={isMediumUpScreenWidth ? { textAlign: "right" } : {}}>{row.value}</Grid>
              <Grid item xs={12}><Divider /></Grid>
            </Fragment>
          ))}
        </ResponsiveTwoColumnGrid>

        {metrics && <Metrics metrics={metrics} />}

      </Stack>
      </>
  );
};

export default TrainingDetailsPage;
