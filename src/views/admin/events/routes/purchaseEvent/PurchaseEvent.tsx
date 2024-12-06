import React from "react";
import { useForm } from "react-hook-form";
import useCustomToast from "../../../../../core/hooks/useToastNotification";
import { Box, useDisclosure } from "@chakra-ui/react";
import useAuthApi from "../../../../../core/hooks/useAuthApi";
import PurchaseEventForm from "./components/PurchaseEventForm";
import Header from "../../components/Header";

interface PurchaseEventProps {}

export type NewPurchaseEventForm = {
  cage_id: string;
  category_id: string;
  quantity: number;
  weight: number;
  total_price: number;
  description: string;
  date: Date;
};

function PurchaseEvent(props: PurchaseEventProps) {
  const [loading, setLoading] = React.useState(false);
  const showNotification = useCustomToast();
  const formDisclosure = useDisclosure();
  const authApi = useAuthApi();
  const { onClose: onFormClose } = formDisclosure;

  const useFormInstance = useForm<NewPurchaseEventForm>({
    mode: "onChange",
    defaultValues: {
      cage_id: undefined,
      category_id: undefined,
      quantity: undefined,
      weight: undefined,
      total_price: undefined,
      description: undefined,
      date: new Date(),
    },
  });

  const {formState: { isValid }} = useFormInstance;

  const handleClickSave = async () => {
    setLoading(true);
    await createNewPurchaseEvent(useFormInstance.getValues());
    setLoading(false);
  };

  const parseFormValues = (data: NewPurchaseEventForm) => {
    return {
      ...data,
      date: Math.floor(data.date.getTime() / 1000),
      weight: parseFloat(data.weight.toString()),
      total_price: parseFloat(data.total_price.toString().replace(/[$,]/g, "")),
    }
  }

  const createNewPurchaseEvent = async (data: NewPurchaseEventForm) => {
    try {
      await authApi.post("/events/purchase", parseFormValues(data));
      showNotification(
        "Compra creada",
        "success",
        "El evento de compra se guardó correctamente"
      );
      onFormClose();
    } catch (error) {
      console.error(error);
      setLoading(false);
      showNotification(
        "Error",
        "error",
        "Ocurrió un error al guardar el empadre"
      );
    }
  };

  return (
    <Box>
      <Header
        form={<PurchaseEventForm useFormInstance={useFormInstance} />}
        modalFormSize="md"
        formTitle="Crear nueva compra"
        formDisclosure={formDisclosure}
        onSaveForm={handleClickSave}
        loading={loading}
        isValid={isValid}
      />
    </Box>
  );
}

export default PurchaseEvent;
