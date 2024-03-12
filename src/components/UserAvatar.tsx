import { Avatar, AvatarProps, Tooltip } from "@mui/material";
import { minidenticon } from "minidenticons";

import { IUser } from "../services/User";


const UserAvatar = (props: { user: IUser | string } & AvatarProps) => {
  const { user, key, sx, ...avatarProps } = props;
  const tooltip = typeof user === "string"
    ? user
    : <div style={{ textAlign: "center" }}>{user.username}<br />{`${user.firstName} ${user.lastName}`}</div>;
  const username = typeof user === "string" ? user : user.username;
  const svgURI = "data:image/svg+xml;utf8," + encodeURIComponent(minidenticon(username));
  const initials = typeof user === "string"
    ? user.split(" ").map((n) => n[0]).join("")
    : `${user.firstName?.[0]}${user.lastName?.[0]}`;

  return (
    <Tooltip key={key} title={tooltip}>
      <Avatar src={svgURI} alt={username} sx={{ bgcolor: "#e6f3ff", ...sx }} {...avatarProps}>{initials}</Avatar>
    </Tooltip>
  );
};

export default UserAvatar;
