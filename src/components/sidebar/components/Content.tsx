import React from "react";
import { IRoute } from "../../../interfaces/route.interface";
import { Box, Flex, Stack, Image } from "@chakra-ui/react";
import Links from "./Links";
import logo from "../../../assets/img/sidebar/logo02.png";
import enterpriseLogo from "../../../assets/img/sidebar/enterprise_logo.png";
import HSeparator from "../../separators/HSeparator";

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
      <Flex align='center' direction='column'>
        <Image width="200px" my="20px" src={enterpriseLogo} alt='Logo de empresa' />
        <HSeparator mb='20px' />
      </Flex>
      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="20px" pe={{ md: "16px", "2xl": "1px" }}>
          <Links routes={routes} />
        </Box>
      </Stack>

      <Box mt="auto" mb="40px" display="flex" justifyContent="center">
        <Image width="200px" src={logo}  alt='Cuy manager - sistema de inventario' />
      </Box>
    </Flex>
  );
}

export default Content;
