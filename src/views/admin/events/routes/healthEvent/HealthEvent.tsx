import React from "react";
import useCustomToast from "../../../../../core/hooks/useToastNotification";
import { Box, useDisclosure } from "@chakra-ui/react";
import useAuthApi from "../../../../../core/hooks/useAuthApi";
import { useForm } from "react-hook-form";
import Header from "../../components/Header";
import HealthEventForm from "./components/HealthEventForm";

interface HealthEventProps {}

export type NewHealthEventForm = {
  cage_id: string;
  category_id: string;
  quantity: number | undefined;
  description: string;
  date: Date;
};

function HealthEvent(props: HealthEventProps) {
  const [loading, setLoading] = React.useState(false);
  const showNotification = useCustomToast();
  const formDisclosure = useDisclosure();
  const authApi = useAuthApi();

  const { onClose: onFormClose } = formDisclosure;

  const useFormInstance = useForm<NewHealthEventForm>({
    mode: "onChange",
    defaultValues: {
      cage_id: undefined,
      category_id: undefined,
      quantity: undefined,
      description: undefined,
      date: new Date(),
    },
  });

  const {
    formState: { isValid },
  } = useFormInstance;

  const handleClickSave = async () => {
    setLoading(true);
    await createNewHealthEvent(useFormInstance.getValues());
    setLoading(false);
    onFormClose();
  };

  const parseFormValues = (data: NewHealthEventForm) => {
    return {
      ...data,
      date: Math.floor(data.date.getTime() / 1000),
    };
  };

  const createNewHealthEvent = async (data: NewHealthEventForm) => {
    try {
      await authApi.post("/events/health", parseFormValues(data));
      showNotification(
        "Evento creado",
        "success",
        "El evento de sanidad ha sido creado exitosamente"
      );
    } catch (error) {
      showNotification("Error", "error", "Ocurrió un error al crear el evento de sanidad");
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Box>
        <Header
            form={<HealthEventForm useFormInstance={useFormInstance} />}
            modalFormSize="md"
            loading={loading}
            onSaveForm={handleClickSave}
            isValid={isValid}
            formDisclosure={formDisclosure}
            formTitle="Nuevo evento de sanidad"
        />
    </Box>
  );
}

export default HealthEvent;
