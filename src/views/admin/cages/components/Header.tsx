import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
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
import React, { useEffect } from "react";
import useCustomToast from "../../../../core/hooks/useToastNotification";
import useAuthApi from "../../../../core/hooks/useAuthApi";
import { ICage } from "../../../../interfaces/api/cages.interface";

interface HeaderProps {
  selectedCage: ICage | null;
  setSelectedCage: (cage: ICage | null) => void;
  onRefresh: () => void;
}

function Header(props: HeaderProps) {
  const { onRefresh, selectedCage, setSelectedCage } = props;
  const initialRef = React.useRef<HTMLInputElement>(null);
  const authApi = useAuthApi();
  const showNotification = useCustomToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = React.useState(false);
  const [formChanged, setFormChanged] = React.useState(false);
  const [form, setForm] = React.useState({ code: "", capacity: 0 });

  useEffect(() => {
    if (selectedCage) {
      setForm({ code: selectedCage.code, capacity: selectedCage.capacity });
      onOpen();
    }
  }, [selectedCage, onOpen]);

  const closeForm = () => {
    setForm({ code: "", capacity: 0 });
    setSelectedCage(null);
    setFormChanged(false);
    onClose();
  };

  const handleClickSave = async () => {
    try {
      setLoading(true);
      if (selectedCage) {
        await authApi.put(`/cages/${selectedCage.id}`, form);
      } else {
        await authApi.post("/cages", form);
      }
      await onRefresh();
      setLoading(false);
      closeForm();
      showNotification(
        selectedCage ? "Jaula actualizada" : "Jaula creada",
        "success",
        `La jaula ha sido ${
          selectedCage ? "actualizada" : "creada"
        } correctamente`
      );
    } catch (error: any) {
      setLoading(false);
      if (error.response?.status === 409) {
        showNotification(
          "Error",
          "error",
          `La jaula con el código: "${form.code}" ya existe`
        );
        return;
      }
      showNotification(
        "Error",
        "error",
        `Ha ocurrido un error al ${
          selectedCage ? "actualizar" : "crear"
        } la jaula`
      );
      console.error(error);
    }
  };

  const updateForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const key = event.target.getAttribute("data-key");
    if (!key) return;
    const value = event.target.value;
    setFormChanged(true);
    setForm({ ...form, [key]: value });
  };

  const validateForm = () => {
    return form.code.trim() !== "" && form.capacity > 0 && formChanged;
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
      <Modal finalFocusRef={initialRef} isOpen={isOpen} onClose={closeForm}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedCage ? "Actualizar" : "Crear"} una jaula
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Código</FormLabel>
              <Input
                data-key="code"
                onChange={updateForm}
                ref={initialRef}
                value={form.code}
                placeholder="Identificador de la jaula"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Capacidad</FormLabel>
              <Input
                data-key="capacity"
                onChange={updateForm}
                type="number"
                value={form.capacity}
                placeholder="Numero máximo de animales"
              />
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
              {selectedCage ? "Actualizar" : "Crear"}
            </Button>
            <Button onClick={closeForm}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Header;
