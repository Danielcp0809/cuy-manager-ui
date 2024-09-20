import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, Portal, useDisclosure } from "@chakra-ui/react";
import { IRoute } from "../../interfaces/route.interface";
import { SidebarContext } from "../../core/contexts/SidebarContext";
import Sidebar from "../../components/sidebar/Sidebar";
import routes from "../../core/routes/routes";
import NavbarAdmin from "../../components/navbar/NavbarAdmin";
import { shallowEqual, useSelector } from "react-redux";
import { IRootState } from "../../core/store/reducers/rootReducer";

function AdminLayout(props: any) {
  const location = useLocation();
  const navigate = useNavigate();
  const { ...rest } = props;
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const [brandText, setBrandText] = useState("Default Brand Text");
  const isLoggedIn = useSelector(
    (state: IRootState) => state.auth.isLoggedIn,
    shallowEqual
  );

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth/login", { state: { previousUrl: location.pathname } });
    }
  }, [isLoggedIn, location.pathname, navigate]);

  useEffect(() => {
    const getActiveRoute = (routes: IRoute[]) => {
      let activeRoute = "";
      for (let i = 0; i < routes.length; i++) {
        if (routes[i].collapse) {
          let collapseActiveRoute: string = getActiveRoute(
            routes[i].items ?? []
          );
          if (collapseActiveRoute !== activeRoute) {
            return collapseActiveRoute;
          }
        } else if (routes[i].category) {
          let categoryActiveRoute: string = getActiveRoute(
            routes[i].items ?? []
          );
          if (categoryActiveRoute !== activeRoute) {
            return categoryActiveRoute;
          }
        } else {
          if (
            window.location.href.indexOf(routes[i].layout + routes[i].path) !==
            -1
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
  const adminRoutes = routes.filter((route) => route.layout === "/admin");
  return isLoggedIn ? (
    <Box>
      <Box>
        <SidebarContext.Provider
          value={{
            toggleSidebar,
            setToggleSidebar,
          }}
        >
          <Sidebar routes={adminRoutes} />
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
              pt={{ base: "170px", md: "100px" }}
            >
              <Outlet />
            </Box>
            <Box>{/* <Footer /> */}</Box>
          </Box>
        </SidebarContext.Provider>
      </Box>
    </Box>
  ) : null;
}

export default AdminLayout;
