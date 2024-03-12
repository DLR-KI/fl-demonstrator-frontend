import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Box, Chip } from '@mui/material';
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

export default function MultipleSelectCheckmarks({data}: {data: Array<any>}) {
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
