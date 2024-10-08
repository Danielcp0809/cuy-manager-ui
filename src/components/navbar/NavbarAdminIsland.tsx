import {
  Avatar,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  useColorModeValue,
  Text,
  MenuItem,
} from "@chakra-ui/react";
import React from "react";
import { SidebarResponsive } from "../sidebar/Sidebar";
import routes from "../../core/routes/routes";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setLogoutSession } from "../../core/store/slices/authSlice";
import { IRootState } from "../../core/store/reducers/rootReducer";

interface NavbarAdminIslandProps {
  secondary?: boolean;
  variant?: string,
  fixed?: boolean,
  onOpen?: any
  logoText?: string;
  scrolled?: boolean;
}

function NavbarAdminIsland(props: NavbarAdminIslandProps) {
  const { secondary } = props;
  // const navbarIcon: string = useColorModeValue("gray.400", "white");
  let menuBg: string = useColorModeValue("white", "navy.800");
  const textColor: string = useColorModeValue("secondaryGray.900", "white");
  // const textColorBrand: string = useColorModeValue("brand.700", "brand.400");
  const borderColor: string = useColorModeValue(
    "#E6ECFA",
    "rgba(135, 140, 189, 0.3)"
  );
  const shadow: string = useColorModeValue(
    "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
    "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
  );
  const adminRoutes = routes.filter((route) => route.layout === "/admin");
  const dispatch = useDispatch();
  const handleClickLogOut = () => {
    dispatch(setLogoutSession());
  };
  const enterprise = useSelector((state: IRootState) => state.auth.enterprise, shallowEqual);
  return (
    <Flex
      w={{ sm: "100%", md: "auto" }}
      pl={{ sm: "20px", md: "10px"}}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      flexWrap={secondary ? { base: "wrap", md: "nowrap" } : "unset"}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      {/* <SearchBar
        mb={secondary ? { base: "10px", md: "unset" } : "unset"}
        me="10px"
        borderRadius="30px"
      /> */}
      <SidebarResponsive routes={adminRoutes} />
      {/* <Menu>
        <MenuButton p="0px">
          <Icon
            mt="6px"
            as={MdNotificationsNone}
            color={navbarIcon}
            w="18px"
            h="18px"
            me="10px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="20px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
          mt="22px"
          me={{ base: "30px", md: "unset" }}
          minW={{ base: "unset", md: "400px", xl: "450px" }}
          maxW={{ base: "360px", md: "unset" }}
        >
          <Flex justify="space-between" w="100%" mb="20px">
            <Text fontSize="md" fontWeight="600" color={textColor}>
              Notifications
            </Text>
            <Text
              fontSize="sm"
              fontWeight="500"
              color={textColorBrand}
              ms="auto"
              cursor="pointer"
            >
              Mark all read
            </Text>
          </Flex>
          <Flex flexDirection="column">
            <MenuItem
              _hover={{ bg: "none" }}
              _focus={{ bg: "none" }}
              px="0"
              borderRadius="8px"
              mb="10px"
            >
            </MenuItem>
            <MenuItem
              _hover={{ bg: "none" }}
              _focus={{ bg: "none" }}
              px="0"
              borderRadius="8px"
              mb="10px"
            >
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu> */}
      <Menu>
        <MenuButton p="0px">
          <Avatar
            _hover={{ cursor: "pointer" }}
            color="white"
            name={enterprise?.name}
            bg="#11047A"
            size="sm"
            w="40px"
            h="40px"
          />
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={borderColor}
              fontSize="sm"
              fontWeight="700"
              color={textColor}
            >
              {enterprise?.name}
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            {/* <MenuItem
              _hover={{ bg: "none" }}
              _focus={{ bg: "none" }}
              borderRadius="8px"
              px="14px"
            >
              <Text fontSize="sm">Configuración de perfil</Text>
            </MenuItem> */}
            <MenuItem
              _hover={{ bg: "none" }}
              _focus={{ bg: "none" }}
              color="red.400"
              borderRadius="8px"
              px="14px"
              onClick={handleClickLogOut}
            >
              <Text fontSize="sm">Cerrar sesión</Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}

export default NavbarAdminIsland;
