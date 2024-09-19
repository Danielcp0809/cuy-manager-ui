import { Box } from "@chakra-ui/react";
import React from "react";

interface TrackProps {
  style?: React.CSSProperties;
  [key: string]: any;
}

interface ThumbProps {
  style?: React.CSSProperties;
  [key: string]: any;
}

interface ViewProps {
  style?: React.CSSProperties;
  [key: string]: any;
}

export const renderTrack: React.FC<TrackProps> = ({ style, ...props }) => {
  const trackStyle: React.CSSProperties = {
    position: "absolute",
    maxWidth: "100%",
    width: 6,
    transition: "opacity 200ms ease 0s",
    opacity: 0,
    background: "transparent",
    bottom: 2,
    top: 2,
    borderRadius: 3,
    right: 0,
  };
  return <div style={{ ...style, ...trackStyle }} {...props} />;
};

export const renderThumb: React.FC<ThumbProps> = ({ style, ...props }) => {
  const thumbStyle: React.CSSProperties = {
    borderRadius: 15,
    background: "rgba(222, 222, 222, .1)",
  };
  return <div style={{ ...style, ...thumbStyle }} {...props} />;
};

export const renderView: React.FC<ViewProps> = ({ style, ...props }) => {
  const viewStyle: React.CSSProperties = {
    marginBottom: -22,
  };
  return (
    <Box
      me={{ base: "0px !important", lg: "-16px !important" }}
      style={{ ...style, ...viewStyle }}
      {...props}
    />
  );
};