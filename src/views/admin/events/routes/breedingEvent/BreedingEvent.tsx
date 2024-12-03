import React from "react";
import BreedingEventForm from "./components/BreedingEventForm";
import { Box, useDisclosure } from "@chakra-ui/react";
import Header from "../../components/Header";

interface BreedingEventProps {}

function BreedingEvent(props: BreedingEventProps) {
  const [loading, setLoading] = React.useState(false);
  const formDisclosure = useDisclosure();
  const { onClose: onFormClose } = formDisclosure;
  
  const handleClickSave = () => {
    console.log("Save");
    onFormClose();
  };

  return (
    <Box display="flex" flexDir="column" rowGap={5}>
      <Header
        form={<BreedingEventForm/>}
        formTitle="Nuevo empadre"
        formDisclosure={formDisclosure}
        onSaveForm={handleClickSave}
        loading={loading}
      />
    </Box>
  );
}

export default BreedingEvent;
