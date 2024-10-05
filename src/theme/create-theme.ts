import {
  extendTheme,
  shouldSkipGeneratingVar,
  type Theme,
} from "@mui/material/styles";

import { setFont } from "./styles/utils";
import { overridesTheme } from "./overrides-theme";
import {
  shadows,
  typography,
  components,
  colorSchemes,
  customShadows,
} from "./core";

// ----------------------------------------------------------------------

export function createTheme(): Theme {
  const initialTheme = {
    colorSchemes,
    shadows: shadows("light"),
    customShadows: customShadows("light"),
    shape: { borderRadius: 8 },
    components,
    typography,
    cssVarPrefix: "",
    shouldSkipGeneratingVar,
  };

  const theme = extendTheme(initialTheme);

  return theme;
}
