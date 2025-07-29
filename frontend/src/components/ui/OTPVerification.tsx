import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { AcUnit } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../../utils/api";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

const OTPVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  // Redirect if no email is provided
  React.useEffect(() => {
    if (!email) {
      navigate("/signup", { replace: true });
    }
  }, [email, navigate]);

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      showSnackbar("Please enter the OTP");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.verifyOTP(email, otp);
      const { token, user } = response.data;

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      showSnackbar("OTP verified successfully!", "success");

      // Redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1500);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to verify OTP";
      showSnackbar(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);

    try {
      // For simplicity, we'll just show a message
      // In a real app, you'd call a resend OTP endpoint
      showSnackbar("Please check your email for the OTP code", "info");
    } catch {
      showSnackbar("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          background: "#f8f9fa",
        }}
      >
        {/* Left Side - Form */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
          }}
        >
          <Container maxWidth="sm">
            {/* Logo and Header */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <AcUnit sx={{ color: "#1976d2", mr: 1, fontSize: 28 }} />
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "#1976d2",
                    fontSize: "1.2rem",
                  }}
                >
                  HD
                </Typography>
              </Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "#333",
                  mb: 1,
                }}
              >
                Verify Email
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  mb: 4,
                }}
              >
                We've sent a verification code to {email}
              </Typography>
            </Box>

            {/* OTP Input */}
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  mb: 1,
                  ml: 1,
                  fontSize: "0.875rem",
                }}
              >
                Enter OTP
              </Typography>
              <TextField
                required
                id="otp-field"
                label=""
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                variant="outlined"
                fullWidth
                placeholder="Enter 6-digit OTP"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976d2",
                    },
                  },
                }}
              />
            </Box>

            {/* Verify Button */}
            <Button
              fullWidth
              variant="contained"
              onClick={handleVerifyOTP}
              disabled={isLoading}
              sx={{
                py: 1.5,
                mb: 3,
                ml: 1,
                maxWidth: "400px",
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
                "&:disabled": {
                  backgroundColor: "#ccc",
                },
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "Verify OTP"
              )}
            </Button>

            {/* Resend OTP Link */}
            <Box sx={{ textAlign: "center", width: "100%", ml: 1 }}>
              <Typography variant="body2" sx={{ color: "#666" }}>
                Didn't receive the code?{" "}
                <Button
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  sx={{
                    color: "#1976d2",
                    textDecoration: "none",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    p: 0,
                    minWidth: "auto",
                    "&:hover": {
                      textDecoration: "underline",
                      background: "none",
                    },
                  }}
                >
                  Resend
                </Button>
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Right Side - Image */}
        <Box
          sx={{
            flex: 1,
            background: "linear-gradient(135deg, #0f1419 0%, #1a2332 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src="/right-column.png"
            alt="Abstract blue flowing design"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </Box>
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

export default OTPVerification;
