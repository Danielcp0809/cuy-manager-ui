import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box, Portal, useDisclosure } from "@chakra-ui/react";
import { IRoute } from "../../interfaces/route.interface";
import { SidebarContext } from "../../contexts/SidebarContext";
import Sidebar from "../../components/sidebar/Sidebar";
import routes from "../../routes/routes";
import NavbarAdmin from "../../components/navbar/NavbarAdmin";

function AdminLayout(props: any) {
  const location = useLocation();
  const { ...rest } = props;
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const [brandText, setBrandText] = useState("Default Brand Text"); 

  useEffect(() => {
    const getActiveRoute = (routes: IRoute[]) => {
      let activeRoute = "Default Brand Text";
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].collapse) {
          let collapseActiveRoute: string = getActiveRoute(routes[i].items ?? []);
          if (collapseActiveRoute !== activeRoute) {
            return collapseActiveRoute;
          }
        } else if (routes[i].category) {
          let categoryActiveRoute: string = getActiveRoute(routes[i].items ?? []);
          if (categoryActiveRoute !== activeRoute) {
            return categoryActiveRoute;
          }
        } else {
          if (
            window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
          ) {
            return routes[i].name;
          }
        }
      }
      return activeRoute;
    };
    setBrandText(getActiveRoute(routes));
  }, [location]);
  const { onOpen } = useDisclosure();
  return (
    <Box>
      <Box>
        <SidebarContext.Provider
          value={{
            toggleSidebar,
            setToggleSidebar,
          }}
        >
          <Sidebar routes={routes} />
          <Box
            float="right"
            minHeight="100vh"
            height="100%"
            overflow="auto"
            position="relative"
            maxHeight="100%"
            w={{ base: "100%", xl: "calc( 100% - 290px )" }}
            maxWidth={{ base: "100%", xl: "calc( 100% - 290px )" }}
            transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
            transitionDuration=".2s, .2s, .35s"
            transitionProperty="top, bottom, width"
            transitionTimingFunction="linear, linear, ease"
          >
            <Portal>
              <Box>
                <NavbarAdmin
                  onOpen={onOpen}
                  logoText={"Horizon UI Dashboard PRO"}
                  brandText={brandText}
                  fixed={fixed}
                  {...rest}
                />
              </Box>
            </Portal>
            <Box
              mx="auto"
              p={{ base: "20px", md: "30px" }}
              pe="20px"
              minH="100vh"
              pt="50px"
            >
              <Outlet />
            </Box>
            <Box>{/* <Footer /> */}</Box>
          </Box>
        </SidebarContext.Provider>
      </Box>
    </Box>
  );
}

export default AdminLayout;
