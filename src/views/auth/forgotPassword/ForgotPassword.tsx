import React from "react";
import AuthDefaultLayout from "../../../layouts/auth/AuthDefaultLayout";
import illustration from "../../../assets/img/auth/auth2.jpg";
import { Flex } from "@chakra-ui/react";
import EmailSender from "./components/EmailSender";
import CodeVerifier from "./components/CodeVerifier";
import UpdatePasswordForm from "./components/UpdatePasswordForm";

interface ForgotPasswordProps {}

function ForgotPassword(props: ForgotPasswordProps) {
  // Chakra color mode
  const [step, setStep] = React.useState(1);
  const [haveCode, setHaveCode] = React.useState(false);
  const [email, setEmail] = React.useState("");

  const nextStep = () => {
    setStep(step + 1);
  };

  const submitNewPasswordRequest = (newPassword: string) => {
    console.log({
      email,
      newPassword,
    })
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
            haveCode={haveCode}
            nextStep={nextStep}
          />
        )}
        {step === 3 && (
          <UpdatePasswordForm 
            submitRequest={submitNewPasswordRequest}
          />
        )}
      </Flex>
    </AuthDefaultLayout>
  );
}

export default ForgotPassword;
