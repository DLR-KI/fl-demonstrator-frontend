// SPDX-FileCopyrightText: 2024 Johannes Unruh <johannes.unruh@dlr.de>
//
// SPDX-License-Identifier: Apache-2.0

import { Avatar, AvatarProps, Tooltip } from "@mui/material";
import { minidenticon } from "minidenticons";

import { IUser } from "../services/User";

/**
 * UserAvatar is a functional component that displays a user's avatar.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {(IUser|string)} props.user - The user object or a string.
 * @param {AvatarProps} avatarProps - The props for the Avatar component.
 * @param {string} props.key - The key property.
 * @param {Object} props.sx - The sx property for styling.
 *
 * @returns {JSX.Element} The UserAvatar component.
 */
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
