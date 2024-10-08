import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
  Image,
} from "@chakra-ui/react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
// Assets
import illustration from "../../../assets/img/auth/auth2.jpg";
import logo from "../../../assets/img/auth/logo01.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { login } from "../../../services/api";

import AuthDefaultLayout from "../../../layouts/auth/AuthDefaultLayout";

import { useDispatch } from "react-redux";
import { setLoginSession } from "../../../core/store/slices/authSlice";

interface LoginProps {}

function Login(props: LoginProps) {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorBrand = useColorModeValue("brand.500", "white");
  const brandStars = useColorModeValue("brand.500", "brand.400");
  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // States
  const [show, setShow] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleClickHidePass = () => setShow(!show);

  const handleClickLogin = async () => {
    if (loading) return;
    try {
      setLoading(true);
      setError("");
      const response = await login(email, password);
      if (response.refresh_token && response.access_token) {
        const { enterprise, refresh_token, access_token } = response;
        dispatch(
          setLoginSession({
            enterprise,
            refreshToken: refresh_token,
            token: access_token,
          })
        );
      } else {
        throw new Error("Error al iniciar sesión");
      }

      setLoading(false);

      navigate(location.state?.previousUrl || "/admin/dashboard");
    } catch (error: any) {
      setLoading(false);
      if (error.response.status === 404) setError("Empresa no encontrada");
      else if (error.response.status === 401) setError("Password incorrecta");
      else setError("Error al iniciar sesión");
    }
  };

  return (
    <AuthDefaultLayout illustrationBackground={illustration}>
      <Flex
        maxW={{ base: "100%", md: "max-content" }}
        w="100%"
        mx={{ base: "auto", lg: "0px" }}
        me="auto"
        h="100%"
        alignItems="start"
        justifyContent="center"
        mb={{ base: "30px", md: "60px" }}
        px={{ base: "25px", md: "0px" }}
        mt={{ base: "40px", md: "5vh" }}
        flexDirection="column"
      >
        <Box
          mb={{ md: "60px", base: "10px" }}
          width="100%"
          display="flex"
          justifyContent="center"
        >
          <Image
            width={{ lg: "350px", sm: "250px" }}
            src={logo}
            alt="Cuy manager - sistema de inventario"
          />
        </Box>
        <Box me="auto">
          <Heading color={textColor} fontSize="36px" mb="10px">
            Iniciar sesión
          </Heading>
          <Text
            mb="36px"
            ms="4px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
          >
            Ingresa tu usuario y contraseña para iniciar sesión!
          </Text>
        </Box>
        <Flex
          zIndex="2"
          direction="column"
          w={{ base: "100%", md: "420px" }}
          maxW="100%"
          background="transparent"
          borderRadius="15px"
          mx={{ base: "auto", lg: "unset" }}
          me="auto"
          mb={{ base: "20px", md: "auto" }}
        >
          <FormControl>
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              Email o usuario<Text color={brandStars}>*</Text>
            </FormLabel>
            <Input
              id="username"
              isRequired={true}
              variant="auth"
              fontSize="sm"
              ms={{ base: "0px", md: "0px" }}
              type="email"
              placeholder="mail@simmmple.com"
              mb="24px"
              fontWeight="500"
              size="lg"
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormLabel
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              display="flex"
            >
              Contraseña<Text color={brandStars}>*</Text>
            </FormLabel>
            <InputGroup size="md">
              <Input
                id="password"
                isRequired={true}
                fontSize="sm"
                placeholder="Min. 8 caracteres"
                mb="24px"
                size="lg"
                type={show ? "text" : "password"}
                variant="auth"
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement display="flex" alignItems="center" mt="4px">
                <Icon
                  color={textColorSecondary}
                  _hover={{ cursor: "pointer" }}
                  as={show ? FaEyeSlash : FaEye}
                  onClick={handleClickHidePass}
                />
              </InputRightElement>
            </InputGroup>
            <Flex justifyContent="space-between" align="center" mb="24px">
              <FormControl display="flex" alignItems="center">
                <Checkbox
                  id="remember-login"
                  colorScheme="brandScheme"
                  me="10px"
                />
                <FormLabel
                  htmlFor="remember-login"
                  mb="0"
                  fontWeight="normal"
                  color={textColor}
                  fontSize="sm"
                >
                  Mantenerme conectado
                </FormLabel>
              </FormControl>
              <NavLink to="/auth/forgot-password">
                <Text
                  color={textColorBrand}
                  fontSize="sm"
                  w="170px"
                  fontWeight="500"
                >
                  Olvidaste tu contraseña?
                </Text>
              </NavLink>
            </Flex>
            <Button
              isLoading={loading}
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              mb="24px"
              disabled={email === "" || password === ""}
              onClick={handleClickLogin}
            >
              Iniciar sesión
            </Button>
          </FormControl>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            maxW="100%"
            mt="0px"
          >
            {/* <Text color={textColorDetails} fontWeight="400" fontSize="14px">
              Not registered yet?
              <NavLink to="/auth/sign-up">
                <Text
                  color={textColorBrand}
                  as="span"
                  ms="5px"
                  fontWeight="500"
                >
                  Create an Account
                </Text>
              </NavLink>
            </Text> */}
          </Flex>
          <Flex>
            <Text color="red.500" fontSize="sm" fontWeight="500">
              {error}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </AuthDefaultLayout>
  );
}

export default Login;
