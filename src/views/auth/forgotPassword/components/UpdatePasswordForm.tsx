import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface UpdatePasswordFormProps {
    submitRequest: any;
}

type UpdatePasswordFrom = {
  newPassword: string;
  confirmPassword: string;
};

function UpdatePasswordForm(props: UpdatePasswordFormProps) {
  const { submitRequest } = props;
  const [showNewPass, setShowNewPass] = React.useState(false);
  const [showConfirmPass, setShowConfirmPass] = React.useState(false);
  //   const [errors, setErrors] = React.useState<IFormsErrors>({});
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";

  const handleClickHideNewPass = () => setShowNewPass(!showNewPass);
  const handleCLickHideConfirmPass = () => setShowConfirmPass(!showConfirmPass);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<UpdatePasswordFrom>({ mode: "onChange" });

  const handleOnSubmit: SubmitHandler<UpdatePasswordFrom> = (data) => {
    submitRequest(data.newPassword);
    console.log("🚀 ~ UpdatePasswordForm ~ data.newPassword:", data.newPassword)
    navigate("/auth/login");
  };

  const password = watch("newPassword");

  return (
    <Box>
      <Box me="auto">
        <Heading color={textColor} fontSize="36px" mb="10px">
          Crear una nueva contraseña
        </Heading>
        <Text
          mb="36px"
          ms="4px"
          color={textColorSecondary}
          fontWeight="400"
          fontSize="md"
        >
          La nueva contraseña debe tener al menos 5 caracteres y contener al
          menos un número.
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
        <FormControl isRequired isInvalid={!!errors.newPassword} mb={1}>
          <FormLabel
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            display="flex"
          >
            Nueva contraseña
          </FormLabel>
          <InputGroup size="md">
            <Input
              id="new-password"
              isRequired={true}
              fontSize="sm"
              placeholder="Min. 8 caracteres"
              mb={!!errors.newPassword ? "0px" : "26px"}
              size="lg"
              type={showNewPass ? "text" : "password"}
              variant="auth"
              {...register("newPassword", {
                required: "La contraseña es requerida",
                minLength: {
                  value: 5,
                  message: "La contraseña debe tener al menos 5 caracteres",
                },
                pattern: {
                  value: /\d/,
                  message: "La contraseña debe tener al menos un número",
                },
                validate: {
                  hasUpperCase: (value) =>
                    /[A-Z]/.test(value) ||
                    "La contraseña debe tener al menos una letra mayúscula",
                },
              })}
            />
            <InputRightElement display="flex" alignItems="center" mt="4px">
              <Icon
                color={textColorSecondary}
                _hover={{ cursor: "pointer" }}
                as={showNewPass ? FaEyeSlash : FaEye}
                onClick={handleClickHideNewPass}
              />
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>
            {errors.newPassword && errors.newPassword.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isRequired isInvalid={!!errors.confirmPassword} mb={1}>
          <FormLabel
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            display="flex"
          >
            Confirmar contraseña
          </FormLabel>
          <InputGroup size="md">
            <Input
              id="confirm-password"
              isRequired={true}
              fontSize="sm"
              placeholder="Min. 8 caracteres"
              mb={!!errors.confirmPassword ? "0px" : "26px"}
              size="lg"
              type={showConfirmPass ? "text" : "password"}
              variant="auth"
              {...register("confirmPassword", {
                required: {
                  value: true,
                  message: "La contraseña es requerida",
                },
                validate: (value) =>
                  value === password || "Las contraseñas no coinciden",
              })}
            />
            <InputRightElement display="flex" alignItems="center" mt="4px">
              <Icon
                color={textColorSecondary}
                _hover={{ cursor: "pointer" }}
                as={showConfirmPass ? FaEyeSlash : FaEye}
                onClick={handleCLickHideConfirmPass}
              />
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage>
            {errors.confirmPassword && errors.confirmPassword.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          isLoading={false}
          fontSize="sm"
          variant="brand"
          fontWeight="500"
          w="100%"
          h="50"
          mb="24px"
          isDisabled={!isValid}
          onClick={handleSubmit(handleOnSubmit)}
        >
          Enviar código
        </Button>
      </Flex>
    </Box>
  );
}

export default UpdatePasswordForm;
