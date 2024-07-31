// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { Box, Chip } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useState } from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

/**
 * MultipleSelectCheckmarks is a functional component that allows multiple selection with checkmarks.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Array<any>} props.data - The data for the select options.
 *
 * @returns {JSX.Element} The MultipleSelectCheckmarks component.
 */
export default function MultipleSelectCheckmarks({ data }: { data: Array<any> }) {
  const [selected, setSelected] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof selected>) => {
    const {
      target: { value },
    } = event;
    setSelected(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <Select
      labelId="demo-multiple-checkbox-label"
      id="demo-multiple-checkbox"
      label="test"
      multiple
      fullWidth
      value={selected}
      onChange={handleChange}
      input={<OutlinedInput label="Tag" />}
      renderValue={(selected) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selected.map((value) => (
            <Chip key={value} label={value} />
          ))}
        </Box>
      )}
      MenuProps={MenuProps}
    >
      {data.map((d: any) => (
        <MenuItem key={d} value={d}>
          <Checkbox checked={selected.indexOf(d) > -1} />
          <ListItemText primary={d} />
        </MenuItem>
      ))}
    </Select>
  );
}
