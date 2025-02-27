import React from "react";
import useCustomToast from "../../../../../core/hooks/useToastNotification";
import { Box, useDisclosure } from "@chakra-ui/react";
import useAuthApi from "../../../../../core/hooks/useAuthApi";
import { useForm } from "react-hook-form";
import Header from "../../components/Header";
import DeadEventForm from "./components/DeadEventForm";

interface DeadEventProps {}

export type NewDeadEventForm = {
  cage_id: string;
  category_id: string;
  quantity: number | undefined;
  description: string;
  unit_weight: number;
  date: Date;
};

function DeadEvent(props: DeadEventProps) {
  const [loading, setLoading] = React.useState(false);
  const showNotification = useCustomToast();
  const formDisclosure = useDisclosure();
  const authApi = useAuthApi();

  const { onClose: onFormClose } = formDisclosure;

  const useFormInstance = useForm<NewDeadEventForm>({
    mode: "onChange",
    defaultValues: {
      cage_id: undefined,
      category_id: undefined,
      quantity: undefined,
      description: undefined,
      unit_weight: undefined,
      date: new Date(),
    },
  });

  const {
    formState: { isValid },
  } = useFormInstance;

  const handleClickSave = async () => {
    setLoading(true);
    await createNewDeadEvent(useFormInstance.getValues());
    setLoading(false);
    onFormClose();
  };

  const parseFormValues = (data: NewDeadEventForm) => {
    return {
      ...data,
      date: data.date.getTime(),
    };
  };

  const createNewDeadEvent = async (data: NewDeadEventForm) => {
    try {
      await authApi.post("/events/dead", parseFormValues(data));
      showNotification(
        "Evento creado",
        "success",
        "El evento de muerte ha sido creado exitosamente"
      );
    } catch (error) {
      showNotification("Error", "error", "Ocurrió un error al crear la venta");
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Box>
      <Header
        form={<DeadEventForm useFormInstance={useFormInstance} />}
        modalFormSize="md"
        formTitle="Nuevo evento de muerte"
        formDisclosure={formDisclosure}
        onSaveForm={handleClickSave}
        loading={loading}
        isValid={isValid}
      />
    </Box>
  );
}

export default DeadEvent;
