import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
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
import useCustomToast from "../../../../core/hooks/useToastNotification";
import useAuthApi from "../../../../core/hooks/useAuthApi";

interface HeaderProps {
  onRefresh: () => void;
}

function Header(props: HeaderProps) {
    const initialRef = React.useRef<HTMLInputElement>(null);
    const authApi = useAuthApi();
  const showNotification = useCustomToast();
  const { onRefresh } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({ code: "", capacity: 0 })

  const closeForm = () => {
    setForm({ code: "", capacity: 0 });
    onClose();
  }

  const handleClickSave = async () => {
    try {
      setLoading(true);
      await authApi.post("/cages", form);
      await onRefresh();
      setLoading(false);
      closeForm();
      showNotification("Jaula creada", "success", "La jaula ha sido creada correctamente");
    } catch (error: any) {
      setLoading(false);
      if(error.response?.status === 409) {
        showNotification("Error", "error", `La jaula con el código: "${form.code}" ya existe`);
        return;
      }
      showNotification("Error", "error", "Ha ocurrido un error al crear la jaula");
      console.error(error);
    }
  };

  const updateForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event.target.getAttribute('data-key');
    if(!key) return;
    const value = event.target.value;
    setForm({ ...form, [key]: value });
  };

  const validateForm = () => {
    return form.code.trim() !== "" && form.capacity > 0;
  }

  return (
    <>
      {}
      <IconButton
        colorScheme="brand"
        aria-label="Crear nueva jaula"
        borderRadius="10px"
        size={"lg"}
        icon={<AddIcon />}
        onClick={onOpen}
      />

      <Modal finalFocusRef={initialRef} isOpen={isOpen} onClose={closeForm}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear una jaula</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Código</FormLabel>
              <Input data-key="code" onChange={updateForm} ref={initialRef} placeholder="Identificador de la jaula" />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Capacidad</FormLabel>
              <Input data-key="capacity" onChange={updateForm} type="number" placeholder="Numero máximo de animales" />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={loading}
              colorScheme="brand"
              mr={3}
              onClick={handleClickSave}
              isDisabled={!validateForm()}
            >
              Save
            </Button>
            <Button onClick={closeForm}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Header;
