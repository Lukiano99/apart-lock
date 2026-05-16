import type { Theme } from '@mui/material/styles';

import { ArrowDownIcon } from './core/components/autocomplete';
import { ChipDeleteIcon } from './core/components/chip';
import { RatingIcon } from './core/components/rating';
import { AlertErrorIcon, AlertInfoIcon, AlertSuccessIcon, AlertWarningIcon } from './core/components/alert';
import { CheckboxIcon, CheckboxCheckedIcon, CheckboxIndeterminateIcon } from './core/components/checkbox';
import { RadioIcon, RadioCheckedIcon } from './core/components/radio';

export function applyJsxDefaultProps(theme: Theme): void {
  const c = theme.components ?? {};

  if (c.MuiAutocomplete) {
    c.MuiAutocomplete.defaultProps = {
      ...c.MuiAutocomplete.defaultProps,
      popupIcon: <ArrowDownIcon />,
    };
  }

  if (c.MuiChip) {
    c.MuiChip.defaultProps = {
      ...c.MuiChip.defaultProps,
      deleteIcon: <ChipDeleteIcon />,
    };
  }

  if (c.MuiRating) {
    c.MuiRating.defaultProps = {
      ...c.MuiRating.defaultProps,
      emptyIcon: <RatingIcon />,
      icon: <RatingIcon />,
    };
  }

  if (c.MuiAlert) {
    c.MuiAlert.defaultProps = {
      ...c.MuiAlert.defaultProps,
      iconMapping: {
        error: <AlertErrorIcon />,
        info: <AlertInfoIcon />,
        success: <AlertSuccessIcon />,
        warning: <AlertWarningIcon />,
      },
    };
  }

  if (c.MuiCheckbox) {
    c.MuiCheckbox.defaultProps = {
      ...c.MuiCheckbox.defaultProps,
      icon: <CheckboxIcon />,
      checkedIcon: <CheckboxCheckedIcon />,
      indeterminateIcon: <CheckboxIndeterminateIcon />,
    };
  }

  if (c.MuiRadio) {
    c.MuiRadio.defaultProps = {
      ...c.MuiRadio.defaultProps,
      icon: <RadioIcon />,
      checkedIcon: <RadioCheckedIcon />,
    };
  }
}
