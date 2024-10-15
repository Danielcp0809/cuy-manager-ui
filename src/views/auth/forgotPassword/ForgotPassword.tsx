import React from "react";
import AuthDefaultLayout from "../../../layouts/auth/AuthDefaultLayout";
import illustration from "../../../assets/img/auth/auth2.jpg";
import { Flex } from "@chakra-ui/react";
import EmailSender from "./components/EmailSender";
import CodeVerifier from "./components/CodeVerifier";
import UpdatePasswordForm from "./components/UpdatePasswordForm";
import { resetPassword } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import useCustomToast from "../../../core/hooks/useToastNotification";

interface ForgotPasswordProps {}

function ForgotPassword(props: ForgotPasswordProps) {
  // Chakra color mode
  const [step, setStep] = React.useState(1);
  const [haveCode, setHaveCode] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();
  const showNotification = useCustomToast();

  const nextStep = () => {
    setStep(step + 1);
  };

  const goToLogin = () => {
    navigate("/auth/login");
  }

  const submitNewPasswordRequest = async (password: string) => {
    try {
      setLoading(true);
      await resetPassword(email, code, password);
      goToLogin();
      showNotification("Contraseña actualizada", "success", "Tu contraseña ha sido actualizada");
      navigate("/auth/login");
      setLoading(false);
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      if (!error.response) {
        showNotification("Error", "error", "Error al actualizar la contraseña");
        return;
      }
      if (error.response.status === 401) {
        showNotification("Código incorrecto", "error", "El código ingresado no es correcto");
      } else if (error.response.status === 400) {
        showNotification("Código no generado ", "error", "Ningún código no ha sido generado");
      } else if (error.response.status === 404) {
        showNotification("Cuenta inexistente", "error", "No existe una cuenta con ese correo electrónico");
      } else if (error.response.status === 403) {
        showNotification("Código expirado", "error", "El código ha expirado");
      } else {
        showNotification("Error", "error", "Error al actualizar la contraseña");
      }
      goToLogin();
    }
  };

  return (
    <AuthDefaultLayout illustrationBackground={illustration}>
      <Flex
        maxW={{ base: "100%", xl: "420px", md: "420px" }}
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
        {step === 1 && (
          <EmailSender
            email={email}
            setEmail={setEmail}
            setHaveCode={setHaveCode}
            nextStep={nextStep}
          />
        )}
        {step === 2 && (
          <CodeVerifier
            email={email}
            setEmail={setEmail}
            code={code}
            setCode={setCode}
            haveCode={haveCode}
            nextStep={nextStep}
          />
        )}
        {step === 3 && (
          <UpdatePasswordForm 
            submitRequest={submitNewPasswordRequest}
            loading={loading}
          />
        )}
      </Flex>
    </AuthDefaultLayout>
  );
}

export default ForgotPassword;
