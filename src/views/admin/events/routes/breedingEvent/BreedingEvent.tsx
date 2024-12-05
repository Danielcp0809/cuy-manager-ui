import React, { useEffect } from "react";
import BreedingEventForm from "./components/BreedingEventForm";
import { Box, useDisclosure } from "@chakra-ui/react";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";

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
  continuous_breeding: boolean;
};

function BreedingEvent(props: BreedingEventProps) {
  const [loading, setLoading] = React.useState(false);
  const [isSameCategory, setIsSameCategory] = React.useState<boolean>(false);

  const formDisclosure = useDisclosure();
  const { onClose: onFormClose } = formDisclosure;

  const useFormInstance = useForm<NewBreedingEventForm>({ mode: "onChange" });
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

  const handleClickSave = () => {
    setLoading(true);
    console.log("Save");
    console.log(useFormInstance.getValues());
    onFormClose();
    setLoading(false);
  };

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
