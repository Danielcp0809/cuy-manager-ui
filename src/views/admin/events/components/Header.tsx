import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

interface HeaderProps {
  form: React.ReactNode;
  formTitle: string;
  formDisclosure: ReturnType<typeof useDisclosure>;
  loading: boolean;
  isValid: boolean;
  onSaveForm: () => void;
}

function Header(props: HeaderProps) {
  const { form, formTitle, onSaveForm, formDisclosure, loading, isValid } =
    props;
  const { isOpen, onOpen, onClose } = formDisclosure;
  const initialRef = React.useRef<HTMLInputElement>(null);
  const closeForm = () => {
    onClose();
  };
  const handleClickSave = () => {
    onSaveForm();
  };

  return (
    <Box>
      <IconButton
        colorScheme="brand"
        aria-label="Crear nueva jaula"
        borderRadius="10px"
        size={"lg"}
        icon={<AddIcon />}
        onClick={onOpen}
      />
      <Modal
        finalFocusRef={initialRef}
        isOpen={isOpen}
        onClose={closeForm}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{formTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>{form}</ModalBody>
          <ModalFooter>
            <Button
              isLoading={loading}
              isDisabled={!isValid}
              colorScheme="brand"
              mr={3}
              onClick={handleClickSave}
            >
              Crear
            </Button>
            <Button onClick={closeForm}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Header;
