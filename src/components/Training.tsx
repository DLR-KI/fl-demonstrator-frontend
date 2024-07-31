// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import BarChartIcon from "@mui/icons-material/BarChart";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IModel } from "../services/Models";
import { ITraining, TrainingState, TrainingStateLabel } from "../services/Trainings";
import PulsatingDotIcon from "./PulsatingDotIcon";

const getPulsatingDotIcon = (state: TrainingState) => {
  switch (state) {
    case TrainingState.INITIAL:
      return <PulsatingDotIcon color="blue" isAnimated={false} />;
    case TrainingState.ONGOING:
      return <PulsatingDotIcon color="yellow" />;
    case TrainingState.COMPLETED:
      return <PulsatingDotIcon color="green" isAnimated={false} />;
    case TrainingState.ERROR:
      return <PulsatingDotIcon color="red" isAnimated={false} />;
    case TrainingState.SWAG_ROUND:
      return <PulsatingDotIcon color="orange" />;
    default:
      return <PulsatingDotIcon color="black" />;
  }
};

const Training = (props: { training: ITraining, model: IModel }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate("/training/" + props.training.id);
  };

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea onClick={handleCardClick}>
        <CardHeader
          avatar={<BarChartIcon />}
          title={"Training for the " + props.model?.name}
          subheader={new Date(props.training.lastUpdate).toLocaleString()}
        />
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Box display="flex" alignItems="center">
                      <Box component="span" fontWeight="fontWeightBold" flexShrink={0} marginRight={1}>
                        State:
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {TrainingStateLabel[props.training.state]}
                      <Box marginLeft={1}>
                        {getPulsatingDotIcon(props.training.state)}
                      </Box>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <Box display="flex" alignItems="center">
                      <Box component="span" fontWeight="fontWeightBold" flexShrink={0} marginRight={1}>
                        Participants:
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {props.training.participants.length}
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Training;
