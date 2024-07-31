// SPDX-FileCopyrightText: 2024 Martin Lanz <martin.lanz@dlr.de>
// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { Box } from '@mui/material';
import { HighlightScope } from "@mui/x-charts";
import { LineChart } from '@mui/x-charts/LineChart';
import { IMetric } from "../services/Metric";
import { IUser } from "../services/User";

/**
 * Predefined colors for the chart.
 */
export const colors = ["#8e8387", "#6bac9c", "#d8c343", "#ef9a2a", "#ea2e2d"];

/**
 * Interface representing a step in the chart.
 */
interface Step {
  id: string;
  data: any[];
}

/**
 * Interface representing grouped data by step.
 */
interface GroupedByStep {
  [step: number]: number[];
}

/**
 * Generates the series data for a participant.
 *
 * @param participant - The participant data.
 * @param metricByKey - The array of metrics filtered by key.
 * @returns The series data for the participant.
 */
const getParticipantSeries = (participant: IUser, metricByKey: Array<IMetric>) => {
  let participantMetric = metricByKey.filter((metric) => metric.reporter === participant.id);

  let data = participantMetric.map((m: any) => m["valueFloat"]);
  return {
    id: participant.id,
    label: (location: 'tooltip' | 'legend') => {
      if (location === 'tooltip') {
        return participant.firstName + " " + participant.lastName;
      } else {
        return participant.firstName.charAt(0) + ". " + participant.lastName;
      }
    },
    data: data,
    area: true,
    showMark: false,
    highlightScope: {
      highlighted: "item",
      faded: "global",
    } as HighlightScope,
  };
};

/**
 * Calculates the server mean values for the given metrics.
 *
 * @param metricByKey - The array of metrics filtered by key.
 * @returns An array of mean values for each step.
 */
const calculateServerMean = (metricByKey: Array<IMetric>) => {
  const groupedByStep: GroupedByStep = metricByKey.reduce((acc, curr) => {
    const step = curr.step;
    const value = curr.valueFloat ?? 0;

    if (!acc[step]) {
      acc[step] = [];
    }
    acc[step].push(value);

    return acc;
  }, {} as GroupedByStep);

  const sortedSteps = Object.keys(groupedByStep)
    .map((step) => parseInt(step, 10))
    .sort((a, b) => a - b);

  const meansByStep = sortedSteps.map((step) => {
    const values = groupedByStep[step];
    const sum = values.reduce((acc: number, value: number) => acc + value, 0);
    return sum / values.length;
  });

  return meansByStep;
};

/**
 * Retrieves the steps data for a participant.
 *
 * @param participant - The participant data.
 * @param metricByKey - The array of metrics filtered by key.
 * @returns The steps data for the participant.
 */
const getParticipantSteps = (participant: IUser, metricByKey: Array<IMetric>) => {
  let m = metricByKey.filter((metric) => metric.reporter === participant.id);
  return {
    id: "xAxis" + participant.id,
    data: m.map((m: any) => m["step"]),
  };
};

/**
 * Generates the chart data for the participants based on the selected metric key.
 *
 * @param modelMetrics - The array of all metrics.
 * @param participants - The array of all participants.
 * @param key - The selected metric key.
 * @param selectedParticipantId - The ID of the selected participant (default: "all").
 * @param height - The height of the chart (default: 400).
 * @param topMargin - The top margin of the chart (default: 150).
 * @returns The JSX element representing the chart.
 */
export const getParticipantChartByKey = (
  modelMetrics: IMetric[],
  participants: Array<IUser>,
  key: string,
  selectedParticipantId = "all",
  height = 400,
  topMargin = 150
) => {
  let metricByKey = modelMetrics.filter((metric) => metric.key === key);
  let series = [];
  let steps: Step[] = [];
  let chartColors: string[] = [];
  const participantColors = participants.map((p) => p.color);

  if (selectedParticipantId !== "all" && selectedParticipantId !== "serverMean") {
    const filteredParticipants = participants.filter((p) => p.id === selectedParticipantId);

    steps = [getParticipantSteps(filteredParticipants[0], metricByKey)];
    series = [getParticipantSeries(filteredParticipants[0], metricByKey)];

    chartColors = [filteredParticipants[0].color];

  } else {
    steps = participants.map((p) => getParticipantSteps(p, metricByKey));
    if (selectedParticipantId === "all") {
      series = participants.map((p) => getParticipantSeries(p, metricByKey));
      chartColors = participantColors;
    } else {
      const serverMeanValue = calculateServerMean(metricByKey);
      const serverMeanSeries = {
        id: "serverMean",
        label: "Server Mean",
        data: serverMeanValue,
        area: true,
        showMark: false,
        highlightScope: {
          highlighted: "item",
          faded: "global",
        } as HighlightScope,
      };
      series = [serverMeanSeries];
      chartColors = participantColors;
    }
  }

  const stepKeys = new Set();
  steps.forEach((step) => {
    if (stepKeys.has(step.id)) {
      console.error(`Duplicate step key found: ${step.id}`);
    } else {
      stepKeys.add(step.id);
    }
  });

  const seriesIds = new Set();
  series.forEach((serie) => {
    if (seriesIds.has(serie.id)) {
      console.error(`Duplicate series id found: ${serie.id}`);
    } else {
      seriesIds.add(serie.id);
    }
  });

  return (
    <Box>
      <LineChart
        xAxis={steps}
        yAxis={[{ id: "y-Axis", scaleType: "linear" }]}
        series={series}
        height={height}
        margin={{ left: 70, top: topMargin }}
        colors={chartColors}
        onAreaClick={undefined}
        onLineClick={undefined}
        onMarkClick={undefined}
      />
    </Box>
  );
};

/**
 * Retrieves the unique metric keys from the provided metrics.
 *
 * @param modelMetrics - The array of all metrics.
 * @returns An array of unique metric keys.
 */
export const getMetricKeys = (modelMetrics: IMetric[]): Array<string> => {
  const keys = Array.from(new Set(modelMetrics.map((item) => item.key)));
  return keys;
};
