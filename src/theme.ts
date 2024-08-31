"use client";
import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme();

const darkTheme = createTheme({ palette: { mode: "dark" } });

export const theme = {
  light: lightTheme,
  dark: darkTheme,
};
