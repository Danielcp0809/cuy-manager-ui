import React from "react";
import useCustomToast from "../../../../../core/hooks/useToastNotification";
import { Box, useDisclosure } from "@chakra-ui/react";
import useAuthApi from "../../../../../core/hooks/useAuthApi";
import { useForm } from "react-hook-form";
import Header from "../../components/Header";
import FattenEventForm from "./components/FattenEventForm";

interface FattenEventProps {}

export type NewFattenEventForm = {
  origin_cage_id: string;
  category_id: string;
  destiny_cage_id: string;
  quantity: number | undefined;
  description: string;
  date: Date;
};

function FattenEvent(props: FattenEventProps) {
  const [loading, setLoading] = React.useState(false);
  const showNotification = useCustomToast();
  const formDisclosure = useDisclosure();
  const authApi = useAuthApi();
  const { onClose: onFormClose } = formDisclosure;

  const useFormInstance = useForm<NewFattenEventForm>({
    mode: "onChange",
    defaultValues: {
      origin_cage_id: undefined,
      category_id: undefined,
      destiny_cage_id: undefined,
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
    await createNewFattenEvent(useFormInstance.getValues());
    setLoading(false);
  };

  const parseFormValues = (data: NewFattenEventForm) => {
    return {
      ...data,
      date: Math.floor(data.date.getTime() / 1000),
    };
  };

  const createNewFattenEvent = async (data: NewFattenEventForm) => {
    try {
      await authApi.post("/events/fatten", parseFormValues(data));
      showNotification(
        "Evento creado",
        "success",
        "El evento de engorde se guardó correctamente"
      );
      onFormClose();
    } catch (error) {
      console.error(error);
      setLoading(false);
      showNotification(
        "Error",
        "error",
        "Ocurrió un error al guardar el engorde"
      );
    }
  };

  return (
    <Box>
      <Header
        form={<FattenEventForm useFormInstance={useFormInstance} />}
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

export default FattenEvent;
