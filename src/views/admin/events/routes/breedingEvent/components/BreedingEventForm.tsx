import {
  Box,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React from "react";

interface BreedingEventFormProps {}

function BreedingEventForm(props: BreedingEventFormProps) {
  return (
    <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={5}>
      <Box minW={{ base: "100%", lg: 200 }}>
        <Text>Selección Machos</Text>
        <Box display="flex" flexDir="column" rowGap={5}>
          <FormControl>
            <FormLabel>Jaula</FormLabel>
            <Input data-key="code" placeholder="Selecciona una jaula" />
          </FormControl>
          <FormControl>
            <FormLabel>Categoría</FormLabel>
            <Input data-key="category" placeholder="Selecciona una categoría" />
          </FormControl>
          <FormControl>
            <FormLabel>Cantidad</FormLabel>
            <Input data-key="quantity" placeholder="Selecciona una categoría" />
          </FormControl>
        </Box>
      </Box>
      <Box minW={{ base: "100%", lg: 200 }}>
        <Text>Selección Hembras</Text>
        <Box display="flex" flexDir="column" rowGap={5}>
          <FormControl>
            <FormLabel>Jaula</FormLabel>
            <Input data-key="code" placeholder="Selecciona una jaula" />
          </FormControl>
          <FormControl>
            <FormLabel>Categoría</FormLabel>
            <Input data-key="category" placeholder="Selecciona una categoría" />
          </FormControl>
          <FormControl>
            <FormLabel>Cantidad</FormLabel>
            <Input data-key="quantity" placeholder="Selecciona una categoría" />
          </FormControl>
        </Box>
      </Box>
      <Box>
      <Text>Destino</Text>
      <Box display="flex" flexDir="column" rowGap={5}>
      <FormControl>
            <FormLabel>Jaula</FormLabel>
            <Input data-key="code" placeholder="Selecciona una jaula" />
          </FormControl>
          <FormControl>
            <FormLabel>Descripción</FormLabel>
            <Textarea data-key="code" placeholder="Información adicional" />
          </FormControl>
      </Box>
      </Box>
    </SimpleGrid>
  );
}

export default BreedingEventForm;
