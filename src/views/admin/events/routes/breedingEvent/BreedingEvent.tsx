import React, { useEffect } from "react";
import BreedingEventForm from "./components/BreedingEventForm";
import { Box, useDisclosure } from "@chakra-ui/react";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import useCustomToast from "../../../../../core/hooks/useToastNotification";
import useAuthApi from "../../../../../core/hooks/useAuthApi";

interface BreedingEventProps {}

export type NewBreedingEventForm = {
  male: {
    cage_id: string;
    category_id: string;
    quantity: number;
  };
  female: {
    cage_id: string;
    category_id: string;
    quantity: number;
  };
  cage_id: string;
  description: string;
  date: Date;
  months_duration: number;
};

function BreedingEvent(props: BreedingEventProps) {
  const [loading, setLoading] = React.useState(false);
  const [isSameCategory, setIsSameCategory] = React.useState<boolean>(false);
  const showNotification = useCustomToast();
  const formDisclosure = useDisclosure();
  const authApi = useAuthApi();
  const { onClose: onFormClose } = formDisclosure;

  const useFormInstance = useForm<NewBreedingEventForm>({ mode: "onChange", defaultValues: {
    male:{
      cage_id: undefined,
      category_id: undefined,
      quantity: undefined,
    },
    female:{
      cage_id: undefined,
      category_id: undefined,
      quantity: undefined,
    },
    cage_id: undefined,
    description: undefined,
    date: new Date(),
    months_duration: 6,
  }});
  const {
    watch,
    formState: { isValid },
  } = useFormInstance;

  const maleCategoryId = watch("male.category_id");
  const femaleCategoryId = watch("female.category_id");

  useEffect(() => {
    if (!maleCategoryId || !femaleCategoryId) {
      setIsSameCategory(false);
      return;
    };
    setIsSameCategory(maleCategoryId === femaleCategoryId);
  }, [maleCategoryId, femaleCategoryId]);

  const handleClickSave = async () => {
    setLoading(true);
    await createNewBreedingEvent(useFormInstance.getValues());
    setLoading(false);
  };

  const createNewBreedingEvent = async (values: NewBreedingEventForm) => {
    const parsedValues = parseBreedingFormValues(values);
    try {
      await authApi.post("/events/breeding", parsedValues)
      showNotification("Empadre guardado", "success", "El evento se guardó correctamente")
      onFormClose();
    } catch (error) {
      console.error(error)
      setLoading(false)
      showNotification( "Error", "error" ,"Ocurrió un error al guardar el empadre")
    }
  }

  const parseBreedingFormValues = (values: NewBreedingEventForm) => {
    return {
      male_cage_id: values.male.cage_id,
      male_category_id: values.male.category_id,
      male_quantity: values.male.quantity,
      female_cage_id: values.female.cage_id,
      female_category_id: values.female.category_id,
      female_quantity: values.female.quantity,
      cage_id: values.cage_id,
      description: values.description,
      date: Math.floor(values.date.getTime() / 1000),
      months_duration: values.months_duration,
    }
  }

  return (
    <Box display="flex" flexDir="column" rowGap={5}>
      <Header
        form={<BreedingEventForm useFormInstance={useFormInstance} isSameCategory={isSameCategory} />}
        formTitle="Nuevo empadre"
        formDisclosure={formDisclosure}
        onSaveForm={handleClickSave}
        loading={loading}
        isValid={isValid && !isSameCategory}
      />
    </Box>
  );
}

export default BreedingEvent;
