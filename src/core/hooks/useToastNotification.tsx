import { useToast } from "@chakra-ui/react";

const useCustomToast = () => {
  const toast = useToast();

  const showToast = (title: string, status: "success" | "error" | "warning" | "info", message: string) => {
    toast({
      title: title,
      description: message,
      status: status,
      duration: 9000,
      isClosable: true,
    });
  };

  return showToast;
};

export default useCustomToast;