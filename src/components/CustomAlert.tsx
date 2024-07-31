// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import CheckIcon from '@mui/icons-material/Check';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { useState } from 'react';


/**
 * A component that renders a snackbar that auto-hides after a set duration.
 *
 * @param {any} probs - The properties passed to this component.
 * @returns {React.JSX.Element} The rendered JSX element.
 */
export default function CustomAlert(probs: any) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    probs.onExit()
  };

  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message="This Snackbar will be dismissed in 5 seconds."
      >
        <Alert icon={<CheckIcon fontSize="inherit" />} severity={probs.severity ? probs.severity : "success"}>
          {probs.message}
        </Alert>

      </Snackbar>
    </div>
  );
}
