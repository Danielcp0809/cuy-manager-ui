import { Box, useColorModeValue } from "@chakra-ui/react";
import { shallowEqual, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { IRootState } from "../../store/reducers/rootReducer";
import { useEffect } from "react";

interface AuthLayoutProps {}

function AuthLayout(props: AuthLayoutProps) {
  const authBg = useColorModeValue("white", "navy.900");
  const isLoggedIn = useSelector((state: IRootState) => state.auth.isLoggedIn, shallowEqual);
  return !isLoggedIn ? (
    <Box
      bg={authBg}
      float="right"
      minHeight="100vh"
      height="100%"
      position="relative"
      w="100%"
      transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
      transitionDuration=".2s, .2s, .35s"
      transitionProperty="top, bottom, width"
      transitionTimingFunction="linear, linear, ease"
    >
      <Box mx="auto" minH="100vh">
        <Outlet />
      </Box>
    </Box>
  ) : null;
}

export default AuthLayout;
