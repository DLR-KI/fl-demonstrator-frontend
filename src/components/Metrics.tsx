import { Button, Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import Box from "@mui/material/Box";

import { useState } from "react";

import { IMetric } from "../services/Metric";
import { renderLineChart } from "./Charts";


export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

function SimpleDialog(props: Readonly<SimpleDialogProps>) {
  const { onClose, selectedValue, open } = props;
  const handleClose = () => onClose(selectedValue);
  const handleListItemClick = (value: string) => onClose(value);

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Set Filters</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick("Filter1")}  // TODO
          >
            <ListItemText primary="Filter 1" />
          </ListItemButton>
        </ListItem>
        <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick("Filter2")}  // TODO
          >
            <ListItemText primary="Filter 2" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}

const Metrics = ({ metrics }: { metrics: IMetric[] }) => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => setOpen(true);
  const handleClose = (value: string) => setOpen(false);

  // metricsByKey is for example
  // [
  //   [{id: ..., key: "Accuracy", value_float: ...}, ...],
  //   [{id: ..., key: "NLLoss", value_float: ...}, ...]
  // ]
  const keys = Array.from(new Set(metrics.map(metric => metric.key)).values());
  const steps = Array.from(new Set(metrics.map(metric => metric.step)).values());
  const metricsByKey = keys.map(key => metrics.filter(metric => metric.key === key));

  const buildPlot = (metrics: IMetric[], yAxisLabel: string) => {
    // TODO: What about binary metrics (valueBinary)?
    const m = new Map<number, number>();
    const n = new Map<number, number>();
    for (const { step, valueFloat } of metrics) {
      m.set(step, (m.get(step) ?? 0) + (valueFloat ?? 0));
      n.set(step, (n.get(step) ?? 0) + 1);
    }
    const x = [];
    for (const step of steps) {
      x[step - 1] = { step, valueFloat: (m.get(step) ?? 0) / (n.get(step) ?? 0) };
    }
    return { data: x, xAxisDataKey: "step", yAxisDataKeys: ["valueFloat"], xAxisLabel: "", yAxisLabel: yAxisLabel }
  };

  return (
    <>
      {metricsByKey.map((metrics, index: number) => (
        <Box key={keys[index]}>
          {metrics && renderLineChart(buildPlot(metrics, keys[index]))}
          {/* TODO: Implement "View Raw Data" */}
          <Button>
            View Raw Data
          </Button>
          {/* TODO: Implement "Filter" (maybe filter by client and mean) */}
          <Button onClick={handleClickOpen}>
            Filter
          </Button>
          <SimpleDialog
            open={open}
            onClose={handleClose}
            selectedValue={""}
          />
        </Box>
      ))}
    </>
  );
};

export default Metrics;
