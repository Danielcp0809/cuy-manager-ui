import React from "react";
import { Flex } from "@chakra-ui/react";

interface IconBoxProps {
  icon: React.ReactNode;
  [x: string]: any;
}

function IconBox(props: IconBoxProps) {
  const { icon, ...rest } = props;
  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      borderRadius={"50%"}
      {...rest}
    >
      {icon}
    </Flex>
  );
}

export default IconBox;
