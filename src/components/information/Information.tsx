import { Box, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import React from "react";
import Card from "../card/Card";

interface InformationProps {
  title: string;
  value: string | React.ReactNode;
  [key: string]: any;
}

export default function Information(props: InformationProps) {
  const { title, value, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "gray.400";
  const bg = useColorModeValue("white", "navy.700");
  return (
    <Card bg={bg} {...rest} padding={{ sm: "10px", lg: "20px" }}>
      <Box>
        <Text fontWeight="500" color={textColorSecondary} fontSize="sm">
          {title}
        </Text>
        {typeof value === "string" ? (
          <Text color={textColorPrimary} fontWeight="500" fontSize="md">
            {value}
          </Text>
        ) : (
          value
        )}
      </Box>
    </Card>
  );
}
