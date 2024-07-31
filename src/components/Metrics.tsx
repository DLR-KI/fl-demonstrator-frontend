// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
// SPDX-FileCopyrightText: 2024 Martin Lanz <martin.lanz@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from "react";
import { IMetric } from "../services/Metric";
import { ITraining } from "../services/Trainings";
import { IUser } from "../services/User";
import { ParticipantLineChart } from "./ParticipantLineChart";
import { getMetricKeys } from "./Utils";

/**
 * Converts HSL color values to a hexadecimal string.
 *
 * @param h - The hue value (0-360).
 * @param s - The saturation value (0-100).
 * @param l - The lightness value (0-100).
 * @returns The hexadecimal color string.
 */
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/**
 * Generates an array of colors in hexadecimal format.
 *
 * @param n - The number of colors to generate.
 * @returns An array of hexadecimal color strings.
 */
export function getColors(n: number): string[] {
  if (n < 1) return [];
  return Array.from({ length: n }, (_, i) => {
    const hue = i * (360 / n) % 360;
    return hslToHex(hue, 75, 75);
  });
}

/**
 * Props for the Metrics component.
 */
export interface MetricsProps {
  metrics: IMetric[];
  training: ITraining;
  participants: IUser[];
}

/**
 * Metrics component that renders a ParticipantLineChart based on the provided metrics, training, and participants.
 *
 * @param props - The properties for the Metrics component.
 * @returns The rendered Metrics component.
 */
const Metrics = (props: Readonly<MetricsProps>) => {
  const [metricKey, setMetricKey] = useState<string>('');

  useEffect(() => {
    const metricKeys = getMetricKeys(props.metrics);
    if (metricKeys.length > 0 && !metricKey) {
      setMetricKey(metricKeys[0]);
    }
  }, [props.metrics, metricKey]);

  /**
   * Handles the change of the selected metric key.
   *
   * @param event - The mouse event triggered by the user interaction.
   * @param newKey - The new metric key selected.
   */
  const handleChange = (event: React.MouseEvent<HTMLElement>, newKey: string | null) => {
    if (newKey !== null) {
      setMetricKey(newKey);
    }
  };

  const colors = getColors(props.participants.length);

  const newParticipants = props.participants.map((participant, index) => ({
    ...participant,
    colorId: index,
    color: colors[index]
  }));

  return (
    <>
      {metricKey && (
        <ParticipantLineChart
          metricKey={metricKey}
          metrics={props.metrics}
          participants={newParticipants}
          handleChange={handleChange}
        />
      )}
    </>
  );
};

export default Metrics;





