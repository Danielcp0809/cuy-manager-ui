import React, { useEffect } from "react";
import { ICounter } from "../../../../interfaces/api/counters.interface";
import useAuthApi from "../../../../core/hooks/useAuthApi";
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
  Select,
} from "@chakra-ui/react";
import useCustomToast from "../../../../core/hooks/useToastNotification";
import { ICategory } from "../../../../interfaces/api/category.interface";
import { ICage } from "../../../../interfaces/api/cages.interface";
import { IoMdAdd } from "react-icons/io";
import { GoDash } from "react-icons/go";

interface CountersFormProps {
  cage: ICage;
  selectedCounter: ICounter | null;
  categories: ICategory[];
  setSelectedCounter: (counter: ICounter | null) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onRefresh: () => void;
}

const initialFormState = {
  category_id: "",
  amount: 0,
};

function CountersForm(props: CountersFormProps) {
  const {
    onRefresh,
    selectedCounter,
    setSelectedCounter,
    categories,
    isOpen,
    onOpen,
    onClose,
    cage,
  } = props;
  const authApi = useAuthApi();
  const showNotification = useCustomToast();
  const [loading, setLoading] = React.useState(false);
  const [formChanged, setFormChanged] = React.useState(false);
  const [form, setForm] = React.useState(initialFormState);
  const [categoryName, setCategoryName] = React.useState("");

  useEffect(() => {
    if (selectedCounter) {
      const categoryOption = categories.find(
        (cat) => cat.id === selectedCounter.category_id
      );
      setCategoryName(categoryOption ? categoryOption.name : "");
      setForm({
        category_id: categoryOption ? selectedCounter.category_id : "",
        amount: selectedCounter.amount,
      });
      onOpen();
    }
  }, [selectedCounter, onOpen, categories]);

  const closeForm = () => {
    setSelectedCounter(null);
    setFormChanged(false);
    setForm(initialFormState);
    onClose();
  };

  const validateForm = () => {
    return form.category_id !== "" && form.amount > 0 && formChanged;
  };

  const updateAmount = (action: "increase" | "decrease") => {
    let amount = action === "increase" ? form.amount + 1 : form.amount - 1;
    if (amount < 0) amount = 0;
    setFormChanged(true);
    setForm({ ...form, amount });
  };

  const handleClickSave = async () => {
    try {
      setLoading(true);
      if (selectedCounter) {
        await authApi.put(`/counters/${selectedCounter.id}`, {
          ...form,
          cage_id: cage.id,
        });
      } else {
        await authApi.post("/counters", { ...form, cage_id: cage.id });
      }
      await onRefresh();
      setLoading(false);
      closeForm();
      showNotification(
        selectedCounter ? "Contador actualizado" : "Contador creado",
        "success",
        `La contador ha sido ${
          selectedCounter ? "actualizado" : "creado"
        } correctamente`
      );
    } catch (error: any) {
      setLoading(false);
      if (error.response?.status === 409) {
        showNotification(
          "Error",
          "error",
          `El contador con la categoría "${categoryName}" ya existe para esta jaula`
        );
        return;
      }
      showNotification(
        "Error",
        "error",
        `Ha ocurrido un error al ${
          selectedCounter ? "actualizar" : "crear"
        } el contador`
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

  return (
    <Modal isOpen={isOpen} onClose={closeForm}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {selectedCounter ? "Actualizar" : "Crear"} un contador
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Categoría</FormLabel>
            <Select
              disabled={!!selectedCounter}
              data-key="category_id"
              onChange={(event: any) => {
                const category = categories.find(
                  (cat) => cat.id === event.target.value
                );
                setCategoryName(category ? category.name : "");
                updateForm(event);
              }}
              value={form.category_id}
              placeholder="Nombre de la categoría"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Cantidad</FormLabel>
            <Box display="flex" gap="5px">
              <Input
                data-key="amount"
                type="number"
                onChange={updateForm}
                value={form.amount}
                placeholder="Cantidad"
              />
              <Box display="flex" alignItems="center" gap="5px">
                <IconButton
                  aria-label="Aumentar contador"
                  onClick={() => updateAmount("increase")}
                  icon={<IoMdAdd />}
                />
                <IconButton
                  aria-label="Reducir contador"
                  onClick={() => updateAmount("decrease")}
                  icon={<GoDash />}
                />
              </Box>
            </Box>
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
            {selectedCounter ? "Actualizar" : "Crear"}
          </Button>
          <Button onClick={closeForm}>Cancelar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CountersForm;
