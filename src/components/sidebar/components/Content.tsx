import React from "react";
import { IRoute } from "../../../interfaces/route.interface";
import { Box, Flex, Stack } from "@chakra-ui/react";
import Links from "./Links";

interface ContentProps {
  routes: IRoute[];
}

function Content(props: ContentProps) {
  const { routes } = props;
  return (
    <Flex
      direction="column"
      height="100%"
      pt="25px"
      px="16px"
      borderRadius="30px"
    >
      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="20px" pe={{ md: "16px", "2xl": "1px" }}>
          <Links routes={routes} />
        </Box>
      </Stack>
    </Flex>
  );
}

export default Content;
