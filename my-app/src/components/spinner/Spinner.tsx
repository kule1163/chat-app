import React from "react";
import CircleLoader from "react-spinners/CircleLoader";

interface SpinnerProps {
  color?: string;
  size?: number | string;
}

const Spinner = ({ color, size }: SpinnerProps) => {
  return (
    <CircleLoader color={color ? color : "blue"} size={size ? size : 130} />
  );
};

export default Spinner;
