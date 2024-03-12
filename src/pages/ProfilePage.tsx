import { List, ListItemText } from "@mui/material";
import Box from "@mui/material/Box";

import { useState, useEffect } from "react";

import { userService, IUser } from "../services/User";


const ParticipantsPage = () => {
  const [user, setUser] = useState<null | IUser>(null);

  useEffect(() => {
    (async () => {
      const user = await userService.getMyself();
      setUser(user[0]);
    })();
  }, []);

  return (
    <Box>
      {user &&
        <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
          <ListItemText primary={user.username} secondary="username" />
          <ListItemText primary={user.firstName + " " + user.lastName} secondary="name" />
          <ListItemText primary={user.email} secondary="email" />
          <ListItemText primary={user.messageEndpoint} secondary="message endpoint" />
        </List>
      }
    </Box>
  );
};

export default ParticipantsPage;
