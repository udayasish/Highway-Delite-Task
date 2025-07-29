import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Container,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
  CircularProgress,
  ThemeProvider,
  // createTheme,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  Delete,
  Add,
  AccountCircle,
  Logout,
  MoreVert,
  Dashboard as DashboardIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { notesAPI, getErrorMessage } from "../../utils/api";

// const theme = createTheme({
//   typography: {
//     fontFamily: "Roboto, Arial, sans-serif",
//   },
// });

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [notes, setNotes] = useState<Note[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "success" | "warning" | "info",
  });

  const showSnackbar = (
    message: string,
    severity: "error" | "success" | "warning" | "info" = "error"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setUser(JSON.parse(userData));
      fetchNotes();
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const fetchNotes = async () => {
    try {
      const response = await notesAPI.getNotes();
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
      const errorMessage = getErrorMessage(error);
      showSnackbar(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const handleCreateNote = async () => {
    if (newNoteTitle.trim() && newNoteContent.trim()) {
      setIsCreating(true);
      try {
        const response = await notesAPI.createNote(
          newNoteTitle,
          newNoteContent
        );
        setNotes([response.data, ...notes]);
        setNewNoteTitle("");
        setNewNoteContent("");
        setOpenDialog(false);
        showSnackbar("Note created successfully!", "success");
      } catch (error) {
        console.error("Error creating note:", error);
        const errorMessage = getErrorMessage(error);
        showSnackbar(errorMessage);
      } finally {
        setIsCreating(false);
      }
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await notesAPI.deleteNote(noteId);
      setNotes(notes.filter((note) => note._id !== noteId));
      showSnackbar("Note deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting note:", error);
      const errorMessage = getErrorMessage(error);
      showSnackbar(errorMessage);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundColor: "#f8f9fa",
          }}
        >
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (!user) {
    return null;
  }

  const maskedEmail = user.email.replace(/(.{2}).*(@.*)/, "$1****$2");

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
        {/* App Bar */}
        <AppBar
          position="static"
          sx={{
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Toolbar>
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <img
                src="/logo.png"
                alt="HD"
                style={{ height: "32px", marginRight: "12px" }}
              />
            </Box>

            <IconButton onClick={handleMenuOpen} sx={{ color: "#666" }}>
              <MoreVert />
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                },
              }}
            >
              <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
                <AccountCircle sx={{ mr: 2, color: "#666" }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {user.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#666" }}>
                    {maskedEmail}
                  </Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleSignOut} sx={{ py: 1.5 }}>
                <Logout sx={{ mr: 2, color: "#666" }} />
                Sign Out
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container
          maxWidth="lg"
          sx={{
            py: isMobile ? 2 : 4,
            px: isMobile ? 2 : 3,
          }}
        >
          {/* Welcome Section */}
          <Card
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              backgroundColor: "white",
            }}
          >
            <CardContent sx={{ py: isMobile ? 2 : 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <DashboardIcon sx={{ mr: 1, fontSize: isMobile ? 20 : 24 }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    fontSize: isMobile ? "1.25rem" : "1.5rem",
                  }}
                >
                  Welcome back, {user.name}!
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  fontSize: isMobile ? "0.875rem" : "1rem",
                }}
              >
                Manage your notes and stay organized
              </Typography>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
            <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  backgroundColor: "white",
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 2 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      fontSize: isMobile ? "1.75rem" : "2rem",
                    }}
                  >
                    {notes.length}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: isMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    Total Notes
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  backgroundColor: "white",
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 2 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      fontSize: isMobile ? "1.75rem" : "2rem",
                    }}
                  >
                    {
                      notes.filter(
                        (note) =>
                          new Date(note.createdAt).toDateString() ===
                          new Date().toDateString()
                      ).length
                    }
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: isMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    Today's Notes
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box sx={{ flex: "1 1 300px", minWidth: "250px" }}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  backgroundColor: "white",
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 2 }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      fontSize: isMobile ? "1.75rem" : "2rem",
                    }}
                  >
                    {notes.length > 0
                      ? Math.round(
                          notes.reduce(
                            (acc, note) => acc + note.content.length,
                            0
                          ) / notes.length
                        )
                      : 0}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      fontSize: isMobile ? "0.875rem" : "1rem",
                    }}
                  >
                    Avg. Length
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>

          {/* Create Note Button */}
          <Box sx={{ mb: 3 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenDialog(true)}
              sx={{
                py: 1.5,
                backgroundColor: "#1976d2",
                color: "white",
                textTransform: "none",
                fontSize: isMobile ? "0.875rem" : "1rem",
                fontWeight: 500,
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(25, 118, 210, 0.2)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: "#1565c0",
                  boxShadow: "0 4px 16px rgba(25, 118, 210, 0.3)",
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                  boxShadow: "0 2px 8px rgba(25, 118, 210, 0.2)",
                },
              }}
            >
              Create New Note
            </Button>
          </Box>

          {/* Notes Section */}
          <Box sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                color: "#333",
                fontSize: isMobile ? "1.1rem" : "1.25rem",
                mb: 1,
              }}
            >
              Your Notes
            </Typography>
            {notes.length > 0 && (
              <Chip
                label={`${notes.length} note${notes.length !== 1 ? "s" : ""}`}
                size="small"
                sx={{
                  backgroundColor: "#f5f5f5",
                  fontWeight: 500,
                }}
              />
            )}
          </Box>

          {notes.length === 0 ? (
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                backgroundColor: "white",
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Add sx={{ fontSize: 48, color: "#ccc", mb: 2 }} />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#666",
                    fontSize: isMobile ? "1rem" : "1.1rem",
                    mb: 1,
                  }}
                >
                  No notes yet
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#999",
                    fontSize: isMobile ? "0.875rem" : "1rem",
                  }}
                >
                  Create your first note to get started
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {notes.map((note) => (
                <Box
                  sx={{ flex: "1 1 350px", minWidth: "300px" }}
                  key={note._id}
                >
                  <Card
                    sx={{
                      borderRadius: 2,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      backgroundColor: "white",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 500,
                            color: "#333",
                            fontSize: isMobile ? "1rem" : "1.1rem",
                            lineHeight: 1.3,
                          }}
                        >
                          {note.title}
                        </Typography>
                        <IconButton
                          onClick={() => handleDeleteNote(note._id)}
                          size="small"
                          sx={{
                            color: "#ccc",
                            "&:hover": {
                              color: "#d32f2f",
                              backgroundColor: "rgba(211, 47, 47, 0.04)",
                            },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#666",
                          fontSize: isMobile ? "0.875rem" : "1rem",
                          lineHeight: 1.5,
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {note.content}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#999",
                          fontSize: "0.75rem",
                          display: "block",
                        }}
                      >
                        {new Date(note.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          )}

          {/* Create Note Dialog */}
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 2,
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: "bold", color: "#333", pb: 1 }}>
              Create New Note
            </DialogTitle>
            <DialogContent sx={{ pt: 1 }}>
              <TextField
                autoFocus
                margin="dense"
                label="Note Title"
                fullWidth
                variant="outlined"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                label="Note Content"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
              />
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 1 }}>
              <Button
                onClick={() => setOpenDialog(false)}
                sx={{ color: "#666" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateNote}
                variant="contained"
                disabled={isCreating}
                sx={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: 1.5,
                  boxShadow: "0 2px 8px rgba(25, 118, 210, 0.2)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                    boxShadow: "0 4px 16px rgba(25, 118, 210, 0.3)",
                    transform: "translateY(-1px)",
                  },
                  "&:active": {
                    transform: "translateY(0)",
                    boxShadow: "0 2px 8px rgba(25, 118, 210, 0.2)",
                  },
                  "&:disabled": {
                    backgroundColor: "#ccc",
                    color: "#666",
                    transform: "none",
                    boxShadow: "none",
                  },
                }}
              >
                {isCreating ? <CircularProgress size={20} /> : "Create"}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
};

export default Dashboard;
