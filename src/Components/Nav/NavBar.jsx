import React, { useContext, useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  useMediaQuery,
  useTheme,
  Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { useNavigate } from "react-router-dom";
import MyContext from "../../Context/MyContext";
import NavbarMenuItems from "./NavBarMenuItems";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { setLogged, logged, userName } = useContext(MyContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    navigate("/settings");
    handleMenuClose();
  };

  const handleLogout = () => {
    setLogged(false);
    navigate("/login");
    handleMenuClose();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" elevation={0}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* App Title */}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            MO GHARA
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* New Buyer Button/Icon */}
            {isMobile ? (
              <IconButton 
                color="inherit" 
                onClick={() => navigate("/Product-type")}
                sx={{ mr: 1 }}
              >
                <AddIcon />
              </IconButton>
            ) : (
              <Button 
                color="inherit" 
                onClick={() => navigate("/Product-type")}
                sx={{ 
                  mr: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                  transition: 'background-color 0.3s',
                }}
              >
                New Buyer
              </Button>
            )}

            {/* User Menu */}
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              sx={{
                p: 0.5,
                border: `2px solid ${theme.palette.primary.contrastText}`,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
                transition: 'background-color 0.3s',
              }}
            >
              <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                <AccountCircleRoundedIcon />
              </Avatar>
            </IconButton>
          </Box>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "user-menu-button",
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <NavbarMenuItems
              logged={logged}
              userName={userName}
              handleSettings={handleSettings}
              handleLogout={handleLogout}
            />
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;

