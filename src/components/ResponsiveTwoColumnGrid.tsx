// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { Divider, Grid, GridProps, Paper, PaperProps } from "@mui/material";
import { styled } from '@mui/material/styles';


export type TwoColumnGridDatum = string | JSX.Element;
export type TwoColumnGridDataRow = [TwoColumnGridDatum, TwoColumnGridDatum];
export type TwoColumnGridData = TwoColumnGridDataRow[];
export type TwoColumnGridProps = { data?: TwoColumnGridData, gridProps?: GridProps } & PaperProps;

/**
 * ResponsiveTwoColumnGrid is a functional component that renders a responsive two-column grid.
 *
 * @param {TwoColumnGridProps} props - The properties passed to the component.
 *
 * @returns {JSX.Element} The ResponsiveTwoColumnGrid component.
 */
const ResponsiveTwoColumnGrid = (props: TwoColumnGridProps) => {
  const { data, children, gridProps, ...paperProps } = props;
  const GridPaper = styled(Paper)(({ theme }) => ({
    [theme.breakpoints.down("md")]: {
      padding: "8px 16px",
    },
    [theme.breakpoints.up("md")]: {
      padding: "16px",
    },
  }));

  return (
    <GridPaper {...paperProps}>
      <Grid
        container
        className="responsive-2-column-grid"
        rowSpacing={{ md: 1 }}
        columnSpacing={{ md: 3 }}
        {...gridProps}
      >
        {data?.map((row) => (
          <>
            <Grid item xs={12} md={4}>{row[0]}</Grid>
            <Grid item xs={12} md={8}>{row[1]}</Grid>
            <Grid item xs={12}><Divider /></Grid>
          </>
        ))}
        {children}
      </Grid>
    </GridPaper>
  );
};

export default ResponsiveTwoColumnGrid;
