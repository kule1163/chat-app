import styled from "styled-components";

interface ChatProps {
  contentToggle: boolean;
}

export const ChatInfoBox = styled.div<ChatProps>`
  display: block;
  @media (max-width: 1000px) {
    display: ${(props) => (props.contentToggle ? "block" : "none")};
  }
`;

export const TextingBox = styled.div<ChatProps>`
  display: block;
  @media (max-width: 1000px) {
    display: ${(props) => (props.contentToggle ? "none" : "block")};
  }
`;
