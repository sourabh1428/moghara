import React, { useContext, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import MyContext from "../../Context/MyContext";
import { Hidden, useMediaQuery } from "@mui/material";
import AddIcon from '@mui/icons-material/Add'; // New Buyer Icon
import { Settings } from "lucide-react";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { setLogged ,logged,userName} = useContext(MyContext);
  
  // Responsive query for screen sizes
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettings = () => {
    navigate('/settings');
    console.log("Navigating to Settings...");
    handleMenuClose();
  };

  const handleLogout = () => {
    console.log("Logging out...");
    setLogged(false);
    navigate('/login');
    handleMenuClose();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          {/* Title on larger screens */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MO GHARA
          </Typography>

          {/* New Buyer Button with Icon for mobile and text for larger screens */}
          <Hidden smDown>
            <Button color="inherit" onClick={() => navigate('/Product-type')}>
              New Buyer
            </Button>
          </Hidden>
          <Hidden mdUp>
            <IconButton
              color="inherit"
              onClick={() => navigate('/Product-type')}
            >
              <AddIcon />
            </IconButton>
          </Hidden>

          {/* Menu Icon */}
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={handleMenuOpen}
          >
            <MoreVertIcon />
          </IconButton>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "menu-button",
            }}
          >
            {logged && userName==='admin@gmail.com' &&<MenuItem onClick={handleSettings}>Settings </MenuItem>}
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
