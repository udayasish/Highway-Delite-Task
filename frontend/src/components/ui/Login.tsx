import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Container,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { authAPI, getErrorMessage } from "../../utils/api";

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

interface FormErrors {
  email?: string;
  otp?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "success" | "warning" | "info",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validateOTP = (otp: string): string | undefined => {
    if (!otp.trim()) return "OTP is required";
    if (otp.length !== 6) return "OTP must be exactly 6 digits";
    if (!/^\d{6}$/.test(otp)) return "OTP must contain only numbers";
    return undefined;
  };

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

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Clear field error when user starts typing
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    };

  const handleGetOTP = async () => {
    // Validate email
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setFormErrors({ email: emailError });
      showSnackbar(emailError);
      return;
    }

    setIsLoading(true);

    try {
      // Send OTP for login
      await authAPI.sendOTP(formData.email);
      setOtpSent(true);
      showSnackbar(
        "OTP sent successfully! Please check your email.",
        "success"
      );
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      showSnackbar(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    // Validate OTP
    const otpError = validateOTP(formData.otp);
    if (otpError) {
      setFormErrors({ otp: otpError });
      showSnackbar(otpError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.verifyOTP(formData.email, formData.otp);
      const { token, user } = response.data;

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      showSnackbar("Login successful!", "success");

      // Redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1500);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      showSnackbar(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Logo in top left corner - Desktop only */}
      <Box
        sx={{
          position: "fixed",
          top: 20,
          left: 20,
          zIndex: 1000,
          // Mobile styles
          "@media (max-width: 768px)": {
            display: "none",
          },
        }}
      >
        <img src="/logo.png" alt="HD" />
      </Box>

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          background: "#f8f9fa",
          alignItems: "center",
          overflow: "hidden", // Prevent horizontal scroll
          // Mobile styles
          "@media (max-width: 768px)": {
            flexDirection: "column",
            alignItems: "stretch",
            background: "white",
          },
        }}
      >
        {/* Left Side - Form */}
        <Box
          sx={{
            flex: "0 0 40%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 4,
            // Mobile styles
            "@media (max-width: 768px)": {
              flex: "1 1 auto",
              padding: 2,
              paddingTop: 6,
              alignItems: "flex-start",
              justifyContent: "flex-start",
            },
          }}
        >
          <Container
            maxWidth="sm"
            sx={{
              width: "100%",
              // Mobile styles
              "@media (max-width: 768px)": {
                maxWidth: "100%",
                padding: "0 16px",
              },
            }}
          >
            {/* Logo - Mobile only */}
            <Box
              sx={{
                display: "none",
                // Mobile styles
                "@media (max-width: 768px)": {
                  display: "flex",
                  justifyContent: "center",
                  mb: 2,
                  mt: 2,
                },
              }}
            >
              <img src="/logo.png" alt="HD" />
            </Box>

            {/* Header */}
            <Box
              sx={{
                mb: 2,
                // Mobile styles
                "@media (max-width: 768px)": {
                  textAlign: "center",
                  mb: 1,
                },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "bold",
                  color: "#333",
                  mb: 1,
                  // Mobile styles
                  "@media (max-width: 768px)": {
                    fontSize: "1.75rem",
                  },
                }}
              >
                Sign in
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  mb: 2,
                  // Mobile styles
                  "@media (max-width: 768px)": {
                    fontSize: "0.875rem",
                  },
                }}
              >
                Please login to continue to your account.
              </Typography>
            </Box>

            {/* Form */}
            <Box
              component="form"
              sx={{
                width: "100%",
                "& .MuiTextField-root": {
                  width: "100%",
                },
                // Mobile styles
                "@media (max-width: 768px)": {
                  "& .MuiTextField-root": {
                    width: "100%",
                  },
                },
              }}
              noValidate
              autoComplete="off"
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  // Mobile styles
                  "@media (max-width: 768px)": {
                    gap: 2,
                  },
                }}
              >
                {/* Email Field */}
                <Box
                  sx={{
                    mb: 1,
                    width: "100%",
                    // Mobile styles
                    "@media (max-width: 768px)": {
                      mb: 1,
                    },
                  }}
                >
                  <TextField
                    required
                    id="email-field"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        "& fieldset": {
                          borderColor: formErrors.email ? "#d32f2f" : "#e0e0e0",
                        },
                        "&:hover fieldset": {
                          borderColor: formErrors.email ? "#d32f2f" : "#1976d2",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: formErrors.email ? "#d32f2f" : "#1976d2",
                        },
                      },
                    }}
                  />
                </Box>

                {/* OTP Field - Only show after OTP is sent */}
                {otpSent && (
                  <Box
                    sx={{
                      mb: 0.5,
                      width: "100%",
                      // Mobile styles
                      "@media (max-width: 768px)": {
                        mb: 0.5,
                      },
                    }}
                  >
                    <TextField
                      id="outlined-required"
                      label="OTP"
                      type="text"
                      value={formData.otp}
                      onChange={handleInputChange("otp")}
                      error={!!formErrors.otp}
                      helperText={formErrors.otp}
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          "& fieldset": {
                            borderColor: formErrors.otp ? "#d32f2f" : "#e0e0e0",
                          },
                          "&:hover fieldset": {
                            borderColor: formErrors.otp ? "#d32f2f" : "#1976d2",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: formErrors.otp ? "#d32f2f" : "#1976d2",
                          },
                        },
                      }}
                    />
                  </Box>
                )}

                {/* Resend OTP Link - Only show after OTP is sent */}
                {otpSent && (
                  <Box sx={{ mb: 0.5, textAlign: "left" }}>
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleGetOTP();
                      }}
                      sx={{
                        color: "#1976d2",
                        textDecoration: "underline",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Resend OTP
                    </Link>
                  </Box>
                )}

                {/* Keep me logged in checkbox - Only show after OTP is sent */}
                {otpSent && (
                  <Box sx={{ mb: 0.5 }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={keepLoggedIn}
                          onChange={(e) => setKeepLoggedIn(e.target.checked)}
                          sx={{
                            color: "#1976d2",
                            "&.Mui-checked": {
                              color: "#1976d2",
                            },
                          }}
                        />
                      }
                      label="Keep me logged in"
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontSize: "0.875rem",
                          color: "#666",
                        },
                      }}
                    />
                  </Box>
                )}

                {/* Button */}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={otpSent ? handleLogin : handleGetOTP}
                  disabled={isLoading}
                  sx={{
                    py: 1.5,
                    mb: 1,
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
                    // Mobile styles
                    "@media (max-width: 768px)": {
                      py: 1.5,
                      mb: 0.5,
                      fontSize: "1rem",
                      fontWeight: 500,
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : otpSent ? (
                    "Sign in"
                  ) : (
                    "Get OTP"
                  )}
                </Button>

                {/* Sign Up Link */}
                <Box
                  sx={{
                    textAlign: "center",
                    width: "100%",
                    // Mobile styles
                    "@media (max-width: 768px)": {
                      mt: 0.5,
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#666",
                      // Mobile styles
                      "@media (max-width: 768px)": {
                        fontSize: "0.875rem",
                      },
                    }}
                  >
                    Need an account?{" "}
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/signup");
                      }}
                      sx={{
                        color: "#1976d2",
                        textDecoration: "none",
                        cursor: "pointer",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                        // Mobile styles
                        "@media (max-width: 768px)": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Create one
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Right Side - Image */}
        <Box
          sx={{
            flex: "0 0 60%",
            background: "linear-gradient(135deg, #0f1419 0%, #1a2332 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            height: "100vh",
            maxWidth: "60%", // Ensure it doesn't exceed viewport
            // Mobile styles
            "@media (max-width: 768px)": {
              display: "none",
            },
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
              maxWidth: "100%", // Prevent image from overflowing
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

export default Login;
