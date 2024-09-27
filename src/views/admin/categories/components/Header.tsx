import React, { useEffect } from "react";
import { ICategory } from "../../../../interfaces/api/category.interface";
import useAuthApi from "../../../../core/hooks/useAuthApi";
import useCustomToast from "../../../../core/hooks/useToastNotification";
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
import { AddIcon } from "@chakra-ui/icons";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import MaskedInput from "react-text-mask";
import ColorPicker from "../../../../components/colorPicker/ColorPicker";

interface CategoriesHeaderProps {
  selectedCategory: ICategory | null;
  setSelectedCategory: (category: ICategory | null) => void;
  onRefresh: () => void;
}

const initialFormState = {
  name: "",
  description: "",
  price: "",
  color: "",
};

const currencyMask = createNumberMask({
  prefix: "$ ",
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ",",
  allowDecimal: true,
  decimalSymbol: ".",
  decimalLimit: 2, // how many digits allowed after the decimal
  integerLimit: 9, // limit length of integer numbers
  allowNegative: false,
  allowLeadingZeroes: false,
});

function CategoriesHeader(props: CategoriesHeaderProps) {
  const { onRefresh, selectedCategory, setSelectedCategory } = props;
  const initialRef = React.useRef<HTMLInputElement>(null);
  const authApi = useAuthApi();
  const showNotification = useCustomToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = React.useState(false);
  const [formChanged, setFormChanged] = React.useState(false);
  const [form, setForm] = React.useState(initialFormState);

  useEffect(() => {
    if (selectedCategory) {
      setForm({
        name: selectedCategory.name,
        description: selectedCategory.description,
        price: selectedCategory.price.toString(),
        color: selectedCategory.color,
      });
      onOpen();
    }
  }, [selectedCategory, onOpen]);

  const closeForm = () => {
    setForm(initialFormState);
    setSelectedCategory(null);
    setFormChanged(false);
    onClose();
  };

  const handleClickSave = async () => {
    try {
      setLoading(true);
      if (selectedCategory) {
        await authApi.put(`/categories/${selectedCategory.id}`, form);
      } else {
        await authApi.post("/categories", form);
      }
      await onRefresh();
      setLoading(false);
      closeForm();
      showNotification(
        selectedCategory ? "Categoría actualizada" : "Categoría creada",
        "success",
        `La categoría ha sido ${
          selectedCategory ? "actualizada" : "creada"
        } correctamente`
      );
    } catch (error: any) {
      setLoading(false);
      if (error.response?.status === 409) {
        showNotification(
          "Error",
          "error",
          `La categoría con el nombre: "${form.name}" ya existe`
        );
        return;
      }
      showNotification(
        "Error",
        "error",
        `Ha ocurrido un error al ${
          selectedCategory ? "actualizar" : "crear"
        } la categoría`
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
    return (
      form.name.trim() !== "" &&
      form.description.trim() !== "" &&
      Number(form.price) > 0 &&
      formChanged
    );
  };

  return (
    <Box>
      <IconButton
        colorScheme="brand"
        aria-label="Crear nueva categoría"
        borderRadius="10px"
        size={"lg"}
        icon={<AddIcon />}
        onClick={onOpen}
      />
      <Modal finalFocusRef={initialRef} isOpen={isOpen} onClose={closeForm}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedCategory ? "Actualizar" : "Crear"} una categoría
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input
                data-key="name"
                onChange={updateForm}
                ref={initialRef}
                value={form.name}
                placeholder="Nombre de la categoría"
              />
            </FormControl>
            <ColorPicker 
              value={form.color}
              setValue={(value) => {
                setFormChanged(true);
                setForm({ ...form, color: value });
              }}
              label="Color"
            />
            <FormControl mt={4}>
              <FormLabel>Descripción</FormLabel>
              <Input
                data-key="description"
                onChange={updateForm}
                value={form.description}
                placeholder="Descripción de la categoría"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Precio unitario</FormLabel>
              <MaskedInput
                mask={currencyMask}
                value={form.price}
                onChange={(event) => {
                    const value = event.target.value.replace(/[$,]/g, "");
                    setFormChanged(true);
                    setForm({ ...form, price: value });
                }}
                render={(ref: any, props: any) => (
                  <Input
                    {...props}
                    ref={ref}
                    data-key="price"
                    type="text"
                    placeholder="Precio en dólares"
                  />
                )}
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
              {selectedCategory ? "Actualizar" : "Crear"}
            </Button>
            <Button onClick={closeForm}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CategoriesHeader;
