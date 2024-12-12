import React from "react";
import useAuthApi from "../../../../../core/hooks/useAuthApi";
import { Box, useDisclosure } from "@chakra-ui/react";
import useCustomToast from "../../../../../core/hooks/useToastNotification";
import { useForm } from "react-hook-form";
import Header from "../../components/Header";
import SaleEventForm from "./components/SaleEventForm";

interface SaleEventProps {}

export type NewSaleEventForm = {
  category_id: string;
  cage_id: string;
  quantity: number | undefined;
  unit_price: number;
  unit_weight: number;
  description: string;
  date: Date;
};

function SaleEvent(props: SaleEventProps) {
  const [loading, setLoading] = React.useState(false);
  const showNotification = useCustomToast();
  const formDisclosure = useDisclosure();
  const authApi = useAuthApi();
  const { onClose: onFormClose } = formDisclosure;

  const useFormInstance = useForm<NewSaleEventForm>({
    mode: "onChange",
    defaultValues: {
      category_id: undefined,
      cage_id: undefined,
      quantity: undefined,
      unit_price: undefined,
      description: undefined,
      date: new Date(),
    },
  });
  const {
    formState: { isValid },
  } = useFormInstance;

  const handleClickSave = async () => {
    setLoading(true);
    await createNewSaleEvent(useFormInstance.getValues());
    setLoading(false);
    onFormClose();
  };

  const parseFormValues = (data: NewSaleEventForm) => {
    return {
      ...data,
      date: Math.floor(data.date.getTime() / 1000),
      unit_price: parseFloat(data.unit_price.toString().replace(/[$,]/g, "")),
    };
  };

  const createNewSaleEvent = async (data: NewSaleEventForm) => {
    try {
      await authApi.post("/events/sale", parseFormValues(data));
      showNotification(
        "Venta creada",
        "success",
        "La venta se creó correctamente"
      );
    } catch (error: any) {
      if (error.code === "ERR_CANCELED") return;
      showNotification("Error", "error", "Ocurrió un error al crear la venta");
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDir="column" rowGap={5}>
      <Header
        form={<SaleEventForm useFormInstance={useFormInstance} />}
        modalFormSize="md"
        formTitle="Nueva venta"
        formDisclosure={formDisclosure}
        onSaveForm={handleClickSave}
        loading={loading}
        isValid={isValid}
      />
    </Box>
  );
}

export default SaleEvent;
