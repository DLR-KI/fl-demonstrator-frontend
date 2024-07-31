// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { styled } from "@mui/system";
import React from "react";

interface PulsatingDotProps {
  color: string;
  isAnimated?: boolean;
}

const PulsatingDot = styled('div')<PulsatingDotProps>(({ color, isAnimated }) => ({
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  backgroundColor: color,
  animation: isAnimated ? 'pulsate 1s infinite' : 'none',
  '@keyframes pulsate': {
    '0%': {
      transform: 'scale(0.8)',
      opacity: 0.5,
    },
    '50%': {
      transform: 'scale(1.2)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(0.8)',
      opacity: 0.5,
    },
  },
}));

const PulsatingDotIcon: React.FC<PulsatingDotProps> = ({ color, isAnimated = true }) => {
  // DLR Color palette
  if (color === "green") {
    color = "#c7d64f"
  }
  else if (color === "yellow") {
    color = "#ffe043"
  }
  else if (color === "blue") {
    color = "#1fbadf"
  }

  return <PulsatingDot color={color} isAnimated={isAnimated} />;

};


export default PulsatingDotIcon;
