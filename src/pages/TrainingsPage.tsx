// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0


import { Box, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Training from "../components/Training";
import { getModelMetadata, IModel } from "../services/Models";
import { getTrainings, ITraining, TrainingState, TrainingStateLabel } from "../services/Trainings";

/**
 * TrainingsPage is a functional component that fetches and displays a list of trainings.
 *
 * @returns {JSX.Element} A React Fragment that contains a list of Training components.
 */
const TrainingsPage: React.FC = () => {
  const [trainings, setTrainings] = useState<ITraining[] | null>(null);
  const [models, setModels] = useState<{ [key: string]: IModel }>({});
  const [filter, setFilter] = useState<TrainingState | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    getTrainings().then(trainings => {
      setTrainings(trainings);
      trainings.forEach(training => {
        getModelMetadata(training.model).then(model => {
          setModels(prevModels => ({ ...prevModels, [training.model]: model }));
        });
      });
    });
  }, []);

  const handleFilterChange = (event: SelectChangeEvent<TrainingState | "ALL">) => {
    setFilter(event.target.value as TrainingState | "ALL");
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  if (!trainings) {
    return <Typography>Loading...</Typography>;
  }

  const filteredTrainings = trainings.filter(training => {
    const model = models[training.model];
    const matchesFilter = filter === "ALL" || training.state === filter;
    const matchesSearch = model && model.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <React.Fragment>
      <Box mt={5} mb={3} display="flex" justifyContent="space-between">
        <FormControl sx={{ minWidth: 200, mr: 2 }}>
          <InputLabel id="filter-label">Filter by State</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            onChange={handleFilterChange}
            label="Filter by State"
          >
            <MenuItem value="ALL">All</MenuItem>
            {Object.values(TrainingState).map(state => (
              <MenuItem key={state} value={state}>
                {TrainingStateLabel[state]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          sx={{ minWidth: 300 }}
          label="Search by Model Name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Box>

      <Box mt={5}>
        {filteredTrainings.length > 0 ? (
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {filteredTrainings.map((training: ITraining) => (
              <Grid item key={training.id}>
                <Training training={training} model={models[training.model]} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography>No trainings found.</Typography>
        )}
      </Box>
      <Box>
      </Box>
    </React.Fragment>
  );
};

export default TrainingsPage;
