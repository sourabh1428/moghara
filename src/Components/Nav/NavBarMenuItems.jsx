import React from 'react';
import { MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const NavbarMenuItems = ({ logged, userName, handleSettings, handleLogout }) => {
  return (
    <>
      {logged && userName === "admin@gmail.com" && (
        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>
      )}
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Logout</ListItemText>
      </MenuItem>
    </>
  );
};

export default NavbarMenuItems;

