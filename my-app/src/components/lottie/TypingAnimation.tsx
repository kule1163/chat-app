import React from "react";
import Lottie from "react-lottie";
import animationData from "../../assets/animations/typing.json";

const TypingAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoPlay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} width={70} />;
};

export default TypingAnimation;
