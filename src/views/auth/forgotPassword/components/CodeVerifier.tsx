import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  PinInput,
  PinInputField,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { forgotPassword, verifyCode } from "../../../../services/api";
import useCustomToast from "../../../../core/hooks/useToastNotification";

interface CodeVerifierProps {
  haveCode: boolean;
  email: string;
  setEmail: any;
  code: string;
  setCode: any;
  nextStep: () => void;
}

function CodeVerifier(props: CodeVerifierProps) {
  const { haveCode, email, setEmail, nextStep, code, setCode} = props;
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [timeLeft, setTimeLeft] = React.useState(0);
  // Chakra theme
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
  const textColorBrand = useColorModeValue("brand.500", "white");

  const showNotification = useCustomToast();

  useEffect(() => {
    if (timeLeft <= 0) {
      setError("");
      return;
    }
    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1000); // Restar 1 segundo
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const disableButton = () => {
    if (!haveCode) {
      return !email || !code || code.length < 4;
    }
    return !code || code.length < 4;
  };

  const verifyEmail = () => {
    if (!haveCode) return true;
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      setError("Email no válido");
      return false;
    }
    return true;
  };

  const handleVerifyCode = async () => {
    try {
      setError("");
      setTimeLeft(0);
      const isValidEmail = verifyEmail();
      if (!isValidEmail) return;
      setLoading(true);
      await verifyCode(email, code);
      showNotification('Código verificado', 'success', 'El código ha sido verificado correctamente');
      setLoading(false);
      setError("");
      nextStep();
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      if (!error.response) {
        setError("Error al enviar el código")
        return;
      }
      if (error.response.status === 401) {
        setError("Código incorrecto");
      } else if (error.response.status === 400) {
        setError("El código no ha sido generado");
      } else if (error.response.status === 404) {
        setError("El email ingresado no está asociado a ninguna cuenta");
      } else if (error.response.status === 403) {
        setError("Código expirado");
      } else {
        setError("Error al enviar el código");
      }
    }
  };

  const handleSubmitCode = async () => {
    try {
      setError("");
      const isValidEmail = verifyEmail();
      if (!isValidEmail) return;
      await forgotPassword(email);
      showNotification('Código enviado', 'success', 'Se ha enviado un código a tu correo electrónico');
      setError("");
    } catch (error: any) {
      console.error(error);
      if (!error.response) {
        setError("Error al enviar el código")
        return;
      }
      if (error.response.status === 403) {
        setError(
          "Tienes que esperar 5 minutos para volver a enviar el código. Tiempo restante"
        );
        const message = JSON.parse(error.response.data.message);
        setTimeLeft(message.remainingTime);
      } else if (error.response.status === 404) {
        setError("El email ingresado no está asociado a ninguna cuenta");
      } else {
        setError("Error al enviar el código");
      }
    }
  };


  const getRemainingTimeTextError = () => {
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = ((timeLeft % 60000) / 1000).toFixed(0);
    return `${error}: ${minutes}:${Number(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Box>
      <Box me="auto">
        <Heading color={textColor} fontSize="36px" mb="10px">
          Verificación
        </Heading>
        <Text
          mb="36px"
          ms="4px"
          color={textColorSecondary}
          fontWeight="400"
          fontSize="md"
        >
          {haveCode
            ? "Ingresa tu correo y el código de verificación que recibiste."
            : `Ingresa el código enviado a tu correo ${email}. Si no lo has recibido, revisa la bandeja de spam o correo no deseado.`}
        </Text>
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
          {haveCode && (
            <FormControl isRequired>
              <FormLabel
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Email
              </FormLabel>
              <Input
                id="username"
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: "0px", md: "0px" }}
                type="email"
                placeholder="mail@ejemplo.com"
                mb="24px"
                fontWeight="500"
                size="lg"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />
            </FormControl>
          )}
          <FormControl isRequired>
            <FormLabel
              display="flex"
              ms="4px"
              fontSize="sm"
              fontWeight="500"
              color={textColor}
              mb="8px"
            >
              Código
            </FormLabel>
            <HStack justifyContent="center">
              <PinInput size="lg" onChange={(pin) => setCode(pin)}>
                {Array.from({ length: 4 }).map((_, index) => (
                  <PinInputField
                    key={index}
                    w={{ base: "60px", lg: "100px" }}
                    h={{ base: "60px", lg: "100px" }}
                    borderRadius="15px"
                    fontSize="36px"
                  />
                ))}
              </PinInput>
            </HStack>
            <Button
              isLoading={loading}
              fontSize="sm"
              variant="brand"
              fontWeight="500"
              w="100%"
              h="50"
              mt="12px"
              mb="24px"
              isDisabled={disableButton()}
              onClick={handleVerifyCode}
            >
              Verificar código
            </Button>
          </FormControl>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            maxW="100%"
            mt="0px"
          >
            <Text color={textColorDetails} fontWeight="400" fontSize="14px">
              ¿No lo has recibido?
              <Link onClick={handleSubmitCode}>
                <Text
                  color={textColorBrand}
                  as="span"
                  ms="5px"
                  fontWeight="500"
                >
                  Reenviar email
                </Text>
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Box>
      {error && (
        <Alert mt="20px" status="error" borderRadius="10px">
          <AlertIcon />
          {timeLeft > 0 ? getRemainingTimeTextError() : error}
        </Alert>
      )}
    </Box>
  );
}

export default CodeVerifier;
