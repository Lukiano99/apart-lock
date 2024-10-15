"use client";

import { useState, useCallback } from "react";

import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";

import { useDoubleClick } from "@/hooks/use-double-click";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

import { toast } from "src/components/snackbar";
import { Iconify } from "src/components/iconify";
import { ComponentContainer, ComponentBlock } from "../../mui/component-block";

// ----------------------------------------------------------------------

interface CopyToClipboardProps {
  link: string;
}
export function CopyToClipboard({ link }: CopyToClipboardProps) {
  const { copy } = useCopyToClipboard();

  const [value, setValue] = useState(link);

  const textOnClick = `Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia
  Curae; Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat
  dolor lectus quis orci. Cras non dolor.
  `;

  const onCopy = useCallback(
    (text: string) => {
      if (text) {
        toast.success("Copied!");
        copy(text);
      }
    },
    [copy]
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(event.target.value);
    },
    []
  );

  return (
    <ComponentContainer
      sx={{
        // rowGap: 5,
        // columnGap: 3,
        display: "flex",
        my: 0,
        width: 200,
      }}
    >
      <TextField
        fullWidth
        value={value}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Kopiraj">
                <IconButton onClick={() => onCopy(value)}>
                  <Iconify icon="eva:copy-fill" width={24} />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
    </ComponentContainer>
  );
}
