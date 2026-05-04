import { Box, TextField, Typography } from "@mui/material";
import React from "react";

interface Props {
  lable: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  isNumber?: boolean;
}

const TextInput = ({ lable, value, setValue, isNumber }: Props) => {
  const text = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (isNumber && !isNaN(inputValue as unknown as number)) {
      setValue(inputValue);
    }
    if (!isNumber) {
      setValue(inputValue);
    }
  };

  //   const numInput = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     if (event.target.value. )
  //     setValue(event.target.value);
  //   };
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          m: 1,
        }}
      >
        <Typography>{lable}</Typography>
        <TextField value={value} onChange={text}></TextField>
      </Box>
    </div>
  );
};

export default TextInput;
