import React, { useEffect, useState } from 'react';
import { supabase } from '../../Supabase';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editingPassword, setEditingPassword] = useState('');

  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  // Fetch users from Supabase Auth
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: { users }, error } = await supabase.auth.admin.listUsers();

      if (error) throw error;

      // Filter out admin user and set users
      const filteredUsers = users.filter(user => user.email !== 'admin@gmail.com');
      setUsers(filteredUsers);
    } catch (error) {
      setErrorMessage(`Error fetching users: ${error.message}`);
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new user
  const addUser = async () => {
    try {
      clearMessages();

      if (!newUserEmail || !newUserPassword || !newUserName) {
        throw new Error('Name, email, and password are required');
      }

      if (!/^\S+@\S+\.\S+$/.test(newUserEmail)) {
        throw new Error('Invalid email format');
      }

      if (newUserPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const { data, error } = await supabase.auth.admin.createUser({
        email: newUserEmail,
        password: newUserPassword,
        user_metadata: { name: newUserName },
        email_confirm: true,
      });

      if (error) throw error;

      setSuccessMessage('User added successfully!');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserName('');
      await fetchUsers();
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Error adding user:', error);
    }
  };

  // Delete a user
  const deleteUser = async (userId) => {
    try {
      clearMessages();

      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      setSuccessMessage('User deleted successfully!');
      await fetchUsers();
    } catch (error) {
      setErrorMessage(`Error deleting user: ${error.message}`);
      console.error('Error deleting user:', error);
    }
  };

  // Update password
  const updatePassword = async () => {
    try {
      clearMessages();

      if (!editingUser) {
        throw new Error('No user selected for password update');
      }

      if (editingPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const { error } = await supabase.auth.admin.updateUserById(
        editingUser.id,
        { password: editingPassword }
      );

      if (error) throw error;

      setSuccessMessage('Password updated successfully!');
      setEditingUser(null);
      setEditingPassword('');
    } catch (error) {
      setErrorMessage(`Error updating password: ${error.message}`);
      console.error('Error updating password:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Team Management
      </Typography>

      {/* Add User Section */}
      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Add New Team Member
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Name"
                variant="outlined"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth onClick={addUser}>
                Add User
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* User List Section */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Team Members
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : users.length > 0 ? (
            <List>
              {users.map((user) => (
                <ListItem key={user.id} divider>
                  <ListItemText 
                    primary={user.user_metadata?.name || user.email} 
                    secondary={user.email} 
                  />
                  <IconButton edge="end" aria-label="edit" onClick={() => setEditingUser(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => deleteUser(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>No users found.</Typography>
          )}
        </CardContent>
      </Card>

      {/* Edit Password Dialog */}
      <Dialog open={!!editingUser} onClose={() => setEditingUser(null)}>
        <DialogTitle>Edit Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            label="New Password"
            type="password"
            variant="outlined"
            value={editingPassword}
            onChange={(e) => setEditingPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingUser(null)}>
            Cancel
          </Button>
          <Button onClick={updatePassword} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={!!successMessage || !!errorMessage}
        autoHideDuration={6000}
        onClose={clearMessages}
      >
        <Alert
          onClose={clearMessages}
          severity={successMessage ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Team;