import React, { useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Container,
  InputAdornment,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { CalendarToday } from "@mui/icons-material";
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

interface FormData {
  name: string;
  dateOfBirth: string;
  email: string;
  otp: string;
}

interface FormErrors {
  name?: string;
  dateOfBirth?: string;
  email?: string;
  otp?: string;
}

const SignUpComponent: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    dateOfBirth: "",
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
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Name is required";
    if (name.length < 2) return "Name must be at least 2 characters long";
    if (name.length > 50) return "Name must be less than 50 characters";
    if (!/^[a-zA-Z\s]+$/.test(name))
      return "Name can only contain letters and spaces";
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validateDateOfBirth = (dateOfBirth: string): string | undefined => {
    if (!dateOfBirth.trim()) return "Date of birth is required";
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(dateOfBirth))
      return "Date of birth must be in DD/MM/YYYY format";

    const [day, month, year] = dateOfBirth.split("/");
    const birthDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day)
    );
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    const actualAge =
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ? age - 1
        : age;

    if (actualAge < 13) return "You must be at least 13 years old";
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

  const openDatePicker = () => {
    dateInputRef.current?.showPicker();
  };

  const handleInputChange =
    (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleGetOTP = async (): Promise<void> => {
    // Validate all fields
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const dateOfBirthError = validateDateOfBirth(formData.dateOfBirth);

    const errors: FormErrors = {};
    if (nameError) errors.name = nameError;
    if (emailError) errors.email = emailError;
    if (dateOfBirthError) errors.dateOfBirth = dateOfBirthError;

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showSnackbar("Please fix the validation errors");
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.register({
        name: formData.name,
        email: formData.email,
        dateOfBirth: formData.dateOfBirth,
      });

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

  const handleSignUp = async (): Promise<void> => {
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

      // Store token and user data in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      showSnackbar("Account created successfully!", "success");

      // Navigate to dashboard after successful verification
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
            paddingTop: 8,
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
                Sign up
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
                Sign up to enjoy the feature of HD
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
                {/* Name Field */}
                <Box
                  sx={{
                    mb: 1,
                    width: "100%",
                    // Mobile styles
                    "@media (max-width: 768px)": {
                      mb: 2,
                    },
                  }}
                >
                  <TextField
                    id="outlined-name"
                    label="Your Name"
                    defaultValue="Your Name"
                    value={formData.name}
                    onChange={handleInputChange("name")}
                    error={!!formErrors.name}
                    helperText={formErrors.name}
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "white",
                        "& fieldset": {
                          borderColor: formErrors.name ? "#d32f2f" : "#e0e0e0",
                        },
                        "&:hover fieldset": {
                          borderColor: formErrors.name ? "#d32f2f" : "#1976d2",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: formErrors.name ? "#d32f2f" : "#1976d2",
                        },
                      },
                    }}
                  />
                </Box>

                {/* Date of Birth Field */}
                <Box
                  sx={{
                    mb: 1,
                    width: "100%",
                    // Mobile styles
                    "@media (max-width: 768px)": {
                      mb: 2,
                    },
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      id="outlined-date"
                      label="Date of Birth"
                      defaultValue="01/01/2000"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange("dateOfBirth")}
                      error={!!formErrors.dateOfBirth}
                      helperText={formErrors.dateOfBirth}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <CalendarToday
                              sx={{ color: "#666", cursor: "pointer" }}
                              onClick={openDatePicker}
                            />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "white",
                          "& fieldset": {
                            borderColor: formErrors.dateOfBirth
                              ? "#d32f2f"
                              : "#e0e0e0",
                          },
                          "&:hover fieldset": {
                            borderColor: formErrors.dateOfBirth
                              ? "#d32f2f"
                              : "#1976d2",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: formErrors.dateOfBirth
                              ? "#d32f2f"
                              : "#1976d2",
                          },
                        },
                      }}
                    />
                    <input
                      ref={dateInputRef}
                      type="date"
                      style={{
                        position: "absolute",
                        opacity: 0,
                        pointerEvents: "none",
                        width: 0,
                        height: 0,
                      }}
                      onChange={(e) => {
                        if (e.target.value) {
                          const date = new Date(e.target.value);
                          const day = date
                            .getDate()
                            .toString()
                            .padStart(2, "0");
                          const month = (date.getMonth() + 1)
                            .toString()
                            .padStart(2, "0");
                          const year = date.getFullYear();
                          const formattedDate = `${day}/${month}/${year}`;
                          setFormData((prev) => ({
                            ...prev,
                            dateOfBirth: formattedDate,
                          }));
                        }
                      }}
                    />
                  </Box>
                </Box>

                {/* Email Field */}
                <Box
                  sx={{
                    mb: 1,
                    width: "100%",
                    // Mobile styles
                    "@media (max-width: 768px)": {
                      mb: 2,
                    },
                  }}
                >
                  <TextField
                    id="outlined-required"
                    label="Email"
                    defaultValue="Email"
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
                      mb: 1,
                      width: "100%",
                      // Mobile styles
                      "@media (max-width: 768px)": {
                        mb: 2,
                      },
                    }}
                  >
                    <TextField
                      id="outlined-required"
                      label="OTP"
                      defaultValue="OTP"
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

                {/* Button */}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={otpSent ? handleSignUp : handleGetOTP}
                  disabled={isLoading}
                  sx={{
                    py: 1.5,
                    mb: 3,
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
                      mb: 2,
                      fontSize: "1rem",
                      fontWeight: 500,
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : otpSent ? (
                    "Sign up"
                  ) : (
                    "Get OTP"
                  )}
                </Button>

                {/* Sign In Link */}
                <Box
                  sx={{
                    textAlign: "center",
                    width: "100%",
                    // Mobile styles
                    "@media (max-width: 768px)": {
                      mt: 2,
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
                    Already have an account??{" "}
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/login");
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
                      Sign in
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

export default SignUpComponent;
