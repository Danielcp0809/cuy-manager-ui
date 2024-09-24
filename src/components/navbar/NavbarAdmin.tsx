import React, { useEffect, useState } from "react";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Link,
  ResponsiveValue,
  useColorModeValue,
} from "@chakra-ui/react";
import NavbarAdminIsland from "./NavbarAdminIsland";
import { useLocation, Link as domLink } from "react-router-dom";
import { IRoute } from "../../interfaces/route.interface";
import routes from "../../core/routes/routes";

interface NavbarAdminProps {
  brandText?: string;
  secondary?: boolean;
  message?: string;
  onOpen?: any;
  fixed?: boolean;
  logoText?: string;
  [key: string]: any;
}

function NavbarAdmin(props: NavbarAdminProps) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", changeNavbar);

    return () => {
      window.removeEventListener("scroll", changeNavbar);
    };
  });
  const { secondary, brandText } = props;
  // Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
  let mainText = useColorModeValue("navy.700", "white");
  let secondaryText = useColorModeValue("gray.700", "white");
  let navbarPosition: ResponsiveValue<"fixed"> | undefined = "fixed";
  let navbarFilter = "none";
  let navbarBackdrop = "blur(20px)";
  let navbarShadow = "none";
  let navbarBg = useColorModeValue(
    "rgba(244, 247, 254, 0.2)",
    "rgba(11,20,55,0.5)"
  );
  let navbarBorder = "transparent";
  let secondaryMargin = "0px";
  let paddingX = "15px";
  let gap = "0px";
  const changeNavbar = () => {
    if (window.scrollY > 1) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  const pathnames = location.pathname.split("/").filter((x) => x);
  const getRouteName = (path: string, routes: IRoute[]): string => {
    for (let i = 0; i < routes.length; i++) {
      const routePath = routes[i].layout + routes[i].path;
      const match = new RegExp(`^${routePath.replace(/:\w+/g, "[\\w-%]+")}$`).test(path);
      if (match) {
        return routes[i].name || path;
      }
      if (routes[i].collapse || routes[i].category) {
        const nestedName = getRouteName(path, routes[i].items || []);
        if (nestedName) {
          return nestedName;
        }
      }
    }
    return path;
  };

  return (
    <Box
      position={navbarPosition}
      boxShadow={navbarShadow}
      bg={navbarBg}
      borderColor={navbarBorder}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      backgroundPosition="center"
      backgroundSize="cover"
      borderRadius="16px"
      borderWidth="1.5px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      alignItems={{ xl: "center" }}
      display={secondary ? "block" : "flex"}
      minH="75px"
      justifyContent={{ xl: "center" }}
      lineHeight="25.6px"
      mx="auto"
      mt={secondaryMargin}
      pb="8px"
      zIndex={10}
      right={{ base: "12px", md: "30px", lg: "30px", xl: "30px" }}
      px={{
        sm: paddingX,
        md: "10px",
      }}
      ps={{
        xl: "12px",
      }}
      pt="8px"
      top={{ base: "12px", md: "16px", lg: "20px", xl: "20px" }}
      w={{
        base: "calc(100vw - 6%)",
        md: "calc(100vw - 8%)",
        lg: "calc(100vw - 6%)",
        xl: "calc(100vw - 350px)",
        "2xl": "calc(100vw - 365px)",
      }}
    >
      <Flex
        w="100%"
        flexDirection={{
          sm: "column",
          md: "row",
        }}
        alignItems={{ xl: "center" }}
        mb={gap}
      >
        <Box mb={{ sm: "8px", md: "0px" }}>
          <Breadcrumb>
            <BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
              <BreadcrumbLink as={domLink} to="/" color={secondaryText}>
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>

            {pathnames.map((value, index) => {
              const to = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;
              const isLayoutName = value === "admin" || value === "auth";
              const routeName = getRouteName(to, routes);
              return !isLayoutName ? (
                <BreadcrumbItem
                  key={to}
                  color={secondaryText}
                  fontSize="sm"
                  mb="5px"
                >
                  {isLast ? (
                    <BreadcrumbLink href="#" color={secondaryText}>
                      {routeName}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbLink as={domLink} to={to} color={secondaryText}>
                      {routeName}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              ) : null;
            })}
          </Breadcrumb>
          {/* Here we create navbar brand, based on route name */}
          <Link
            color={mainText}
            href="#"
            bg="inherit"
            borderRadius="inherit"
            fontWeight="bold"
            fontSize="34px"
            _hover={{ color: { mainText } }}
            _active={{
              bg: "inherit",
              transform: "none",
              borderColor: "transparent",
            }}
            _focus={{
              boxShadow: "none",
            }}
          >
            {brandText}
          </Link>
        </Box>
        <Box ms="auto" w={{ sm: "100%", md: "unset" }}>
          <NavbarAdminIsland
            onOpen={props.onOpen}
            logoText={props.logoText}
            secondary={props.secondary}
            fixed={props.fixed}
            scrolled={scrolled}
          />
        </Box>
      </Flex>
    </Box>
  );
}

export default NavbarAdmin;
