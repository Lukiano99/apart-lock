import type { Theme, Components } from '@mui/material/styles';

// ----------------------------------------------------------------------

const MuiTimelineDot: any = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: { root: { boxShadow: 'none' } },
};

const MuiTimelineConnector: any = {
  /** **************************************
   * STYLE
   *************************************** */
  styleOverrides: { root: ({ theme }) => ({ backgroundColor: theme.vars.palette.divider }) },
};

// ----------------------------------------------------------------------

export const timeline = { MuiTimelineDot, MuiTimelineConnector };
