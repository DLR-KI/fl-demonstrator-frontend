// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { Box, MenuItem, Select, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import { IMetric } from "../services/Metric";
import { IUser } from "../services/User";
import { getMetricKeys, getParticipantChartByKey } from "./Utils";

/**
 * Properties for the ParticipantLineChart component.
 */
interface ParticipantLineChartProps {
  /**
   * The key of the metric to display.
   */
  metricKey: string;
  /**
   * An array of metric objects.
   */
  metrics: IMetric[];
  /**
   * An array of participant objects.
   */
  participants: IUser[];
  /**
   * Handler for changing the metric key.
   *
   * @param event - The mouse event triggered by the user interaction.
   * @param nextView - The next view to be displayed.
   */
  handleChange: (event: React.MouseEvent<HTMLElement>, nextView: string | null) => void;
}

/**
 * ParticipantLineChart is a React component that serves as the metric tab for displaying training details.
 *
 * @param {ParticipantLineChartProps} props - The properties for the ParticipantLineChart component.
 * @returns {JSX.Element} A React Fragment that contains the entire content of the training details page.
 */
export const ParticipantLineChart: React.FC<ParticipantLineChartProps> = ({ metricKey, metrics, participants, handleChange }) => {
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>("all");

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginBottom="20px"
      >
        <Select
          value={selectedParticipantId}
          onChange={(e) => setSelectedParticipantId(e.target.value as string)}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
          style={{ marginRight: 16 }}
        >
          <MenuItem value="all">All</MenuItem>
          {participants.map((participant: IUser) => (
            <MenuItem key={participant.id} value={participant.id}>{participant.firstName} {participant.lastName}</MenuItem>
          ))}
          <MenuItem value="serverMean">Server Mean</MenuItem>
        </Select>

        <ToggleButtonGroup
          value={metricKey}  // Ensure `metricKey` is correctly used here
          exclusive
          onChange={handleChange}  // Use the `handleChange` passed as a prop
        >
          {getMetricKeys(metrics).map((key) => (
            <ToggleButton key={key} value={key} aria-label={key}>
              {key}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {getParticipantChartByKey(metrics, participants, metricKey, selectedParticipantId)}
    </>
  );
};