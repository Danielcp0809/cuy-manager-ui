import React, { useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorModeValue,
  Link,
  AlertIcon,
  Alert,
} from "@chakra-ui/react";

interface EmailSenderProps {
  nextStep: any;
  email: string;
  setEmail: any;
  setHaveCode: any;
}

function EmailSender(props: EmailSenderProps) {
  const { nextStep, email, setEmail, setHaveCode } = props;
  const [error, setError] = React.useState("");
  const [timeLeft, setTimeLeft] = React.useState(0);
  // const [loading, setLoading] = React.useState(false);
  // const [error, setError] = React.useState("");

  // Chakra theme
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const textColorBrand = useColorModeValue("brand.500", "white");
  const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");

  useEffect(() => {
    if (timeLeft < 0) {
      setError("");
      return;
    };
    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1000); // Restar 1 segundo
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const handleSubmitCode = () => {
    const isValidEmail = validateEmail();
    if (!isValidEmail) return;
    setError("Tienes que esperar 5 minutos para volver a enviar el código. Tiempo restante");
    setTimeLeft(17896);
    // nextStep();
    // setError("");
  };

  const validateEmail = () => {
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
      setError("Email no válido");
      return false;
    }
    return true;
  };

  const handleOnClickHaveCode = () => {
    setHaveCode(true);
    nextStep();
    setError("");
  };

  const getRemainingTimeTextError = () => {
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = ((timeLeft % 60000) / 1000).toFixed(0);
    return `${error}: ${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
  }

  return (
    <Box>
      <Box me="auto">
        <Heading color={textColor} fontSize="36px" mb="10px">
          Olvidaste tu contraseña?
        </Heading>
        <Text
          mb="36px"
          ms="4px"
          color={textColorSecondary}
          fontWeight="400"
          fontSize="md"
        >
          No hay problema!. Ingresa tu correo electrónico y enviaremos un código
          de confirmación para elegir una nueva contraseña.
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
          <Button
            isLoading={false}
            fontSize="sm"
            variant="brand"
            fontWeight="500"
            w="100%"
            h="50"
            mb="24px"
            isDisabled={email === "" || timeLeft > 0}
            onClick={handleSubmitCode}
          >
            Enviar código
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
            ¿Ya tienes el código?
            <Link onClick={handleOnClickHaveCode}>
              <Text color={textColorBrand} as="span" ms="5px" fontWeight="500">
                Verificar código
              </Text>
            </Link>
          </Text>
        </Flex>
      </Flex>
      {error && (
        <Alert mt="20px" status="error" borderRadius="10px">
          <AlertIcon />
          {timeLeft > 0 ? getRemainingTimeTextError() : error}
        </Alert>
      )}
    </Box>
  );
}

export default EmailSender;
