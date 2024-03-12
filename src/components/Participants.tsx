import Stack from '@mui/material/Stack';

import UserAvatar from "./UserAvatar";


// TODO: Implement Participants component
const Participants = () => {
  return (
    <Stack direction="row" spacing={2}>
      <UserAvatar user="Kent Dodds" />
      <UserAvatar user="Jed Watson" />
      <UserAvatar user="Tim Neutkens" />
    </Stack>
  );
};

export default Participants;
