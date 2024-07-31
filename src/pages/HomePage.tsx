// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { Button, Card, CardContent, CardHeader, Stack } from "@mui/material";
import Typography from "@mui/material/Typography";
import { PieChart } from '@mui/x-charts/PieChart';
import ParticlesBg from "particles-bg";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { colors, getParticipantChartByKey } from "../components/Utils";
import { IMetric, getMetric } from "../services/Metric";
import { ITraining, TrainingState, TrainingStateLabel, getTrainings } from '../services/Trainings';
import { IUser, getUsers } from "../services/User";

import { getColors } from "../components/Metrics";

/**
 * Main component of the application.
 * It fetches and manages the state of trainings, models, metrics, and participants.
 * It also renders the main UI of the application including training states, newest training accuracy, and navigation buttons.
 *
 * @returns {JSX.Element} The rendered React component
 */
const Main = () => {
  const navigate = useNavigate();

  const [trainings, setTrainings] = useState<ITraining[]>([]);
  const [lastTraining, setLastTraining] = useState<ITraining>();
  const [lastMetrics, setLastMetrics] = useState<IMetric[]>();

  const [participants, setParticipants] = useState<IUser[]>([]);


  const colorsLineChart = getColors(participants.length);

  const newParticipants = participants.map((participant, index) => ({
    ...participant,
    colorId: index,
    color: colorsLineChart[index]
  }));

  useEffect(() => {
    getTrainings().then(setTrainings);
  }, [])

  useEffect(() => {
    if (!trainings) return;
    // Get newest training
    let sortedTrainings = trainings.sort((a, b) => new Date(a.lastUpdate) < new Date(b.lastUpdate) ? -1 : 1)
    setLastTraining(sortedTrainings.at(-1));
    if (!lastTraining) return;
    console.log(lastTraining)

    getMetric(lastTraining.model).then(setLastMetrics);
    getUsers(lastTraining.participants).then(setParticipants);
  }, [trainings, lastTraining]);

  useEffect(() => {
    if (!lastTraining) return;

    const interval = setInterval(() => {
      getMetric(lastTraining.model).then(setLastMetrics);
    }, 10000); // 10000 milliseconds = 10 seconds

    return () => clearInterval(interval);
  }, [lastTraining]);

  return (
    <Fragment>
      <ParticlesBg type="cobweb" bg={true} num={50} />
      <Stack
        height={200}
        alignItems="center"
        textAlign="center"
        mt={5}
      >
        <Typography variant="h2" component="h2" fontFamily="initial" color="primary">
          Let's learn together
        </Typography>
        <Stack
          direction={"row"}
          spacing={{ xs: 0, sm: 2 }}
        >
          <Typography variant="h4" component="h2" color={colors[0]}>
            federated
          </Typography>
          <Typography variant="h4" component="h2" color={colors[0]}>
            •
          </Typography>
          <Typography variant="h4" component="h2" color={colors[1]}>
            secure
          </Typography>
          <Typography variant="h4" component="h2" color={colors[1]}>
            •
          </Typography>
          <Typography variant="h4" component="h2" color={colors[2]}>
            efficient
          </Typography>
        </Stack>


      </Stack>

      <Stack
        alignItems="center"
        textAlign="center"
        m={5}
      >
        <Button variant="contained" onClick={() => navigate("/trainings")} disableElevation size="large" >
          My Trainings
        </Button>
      </Stack>


      <Stack
        alignItems="center"
        justifyContent="center"
        direction={{ xs: 'column', sm: 'column', md: "row" }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
        <Card variant="outlined" sx={{ width: '100%', height: 450 }}  >
          <CardHeader
            title="Training States"
            subheader={trainings && "Total: " + trainings.length}
          />
          <CardContent>

            <PieChart
              colors={colors} // Use palette
              series={[
                {
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  data: [
                    { id: 0, value: trainings.filter(x => x.state === TrainingState.INITIAL).length, label: TrainingStateLabel[TrainingState.INITIAL] },
                    { id: 1, value: trainings.filter(x => x.state === TrainingState.ONGOING).length, label: TrainingStateLabel[TrainingState.ONGOING] },
                    { id: 2, value: trainings.filter(x => x.state === TrainingState.COMPLETED).length, label: TrainingStateLabel[TrainingState.COMPLETED] },
                    { id: 3, value: trainings.filter(x => x.state === TrainingState.SWAG_ROUND).length, label: TrainingStateLabel[TrainingState.SWAG_ROUND] },
                    { id: 4, value: trainings.filter(x => x.state === TrainingState.ERROR).length, label: TrainingStateLabel[TrainingState.ERROR] },

                  ],
                },
              ]}
              margin={{ right: 200 }}
              height={250}
            />
          </CardContent>

        </Card>
        <Card variant="outlined" sx={{ width: '100%', height: 450 }}>
          <CardHeader
            title="Newest Training Accuracy"
            subheader={lastTraining && "id: " + lastTraining.id}
          />
          <CardContent>
            {lastMetrics && participants && getParticipantChartByKey(lastMetrics, newParticipants, "Accuracy", "all", 360, 160)}
          </CardContent>



        </Card>

      </Stack>


    </Fragment>
  );
};

export default Main;
