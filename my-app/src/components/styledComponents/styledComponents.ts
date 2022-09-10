import { Button } from "@mui/material";
import styled from "styled-components";
import { StatusTypes } from "../../features/types";

interface AsyncButtonProps {
  status: StatusTypes;
  /*   buttonVariant: string */
}

export const AsyncButton = styled(Button)<AsyncButtonProps>`
  pointer-events: ${(props) => (props.status === "pending" ? "none" : "all")};
`;
