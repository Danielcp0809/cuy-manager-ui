/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  SimpleGrid,
  Switch,
  Text,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import CageSelectionForm from "./CageSelectionForm";
import useAuthApi from "../../../../../../core/hooks/useAuthApi";
import useCustomToast from "../../../../../../core/hooks/useToastNotification";
import { ICageOptions } from "../../../../../../interfaces/cages-options.interface";
import { NewBreedingEventForm } from "../BreedingEvent";
import { Controller, FormProvider, UseFormReturn } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getFormattedDate } from "../../../../../../shared/utils";

interface BreedingEventFormProps {
  useFormInstance: UseFormReturn<NewBreedingEventForm, any, undefined>;
  isSameCategory: boolean;
}

function BreedingEventForm(props: BreedingEventFormProps) {
  const { useFormInstance, isSameCategory } = props;
  const [cagesOptions, setCageOptions] = useState<ICageOptions[]>([]);
  const [cagesOptionsList, setCageOptionsList] = useState<
    { id: string; code: string }[]
  >([]);
  const authApi = useAuthApi();
  const showNotification = useCustomToast();

  const {
    control,
    register,
    formState: { errors },
    trigger,
    setValue
  } = useFormInstance;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getData = async () => {
      try {
        const response = await authApi.get("/cages/options", {
          signal: controller.signal,
        });
        isMounted && setCageOptions(response.data);
      } catch (error: any) {
        if (error.code === "ERR_CANCELED") return;
        showNotification(
          "Error",
          "error",
          "Ocurrió un error al obtener las jaulas y categorías"
        );
        console.error(error);
      }
    };
    getData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [authApi]);

  useEffect(() => {
    if (!cagesOptions || cagesOptions.length === 0) return;
    const mappedOptions = cagesOptions.map((cage) => {
      return {
        id: cage.id,
        code: cage.code,
      };
    });
    setCageOptionsList(mappedOptions);
  }, [cagesOptions]);

  useEffect(() => {
    setValue("date", new Date())
    trigger("date")
  },[])

  return (
    <SimpleGrid columns={1} spacing={5}>
      <FormProvider {...useFormInstance}>
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={5}>
          <Box minW={{ base: "100%", lg: 200 }}>
            <Text display="flex" justifyContent="center" as="b">
              Selección Machos
            </Text>
            <CageSelectionForm cages={cagesOptions} prefix="male" />
          </Box>
          <Box minW={{ base: "100%", lg: 200 }}>
            <Text display="flex" justifyContent="center" as="b">
              Selección Hembras
            </Text>
            <CageSelectionForm cages={cagesOptions} prefix="female" />
            {isSameCategory && (
              <Text color="red" fontSize="sm" mt="10px">
                No puedes seleccionar la misma categoría para machos y hembras
              </Text>
            )}
          </Box>
          <Box>
            <Text display="flex" justifyContent="center" as="b">
              Destino
            </Text>
            <Box display="flex" flexDir="column" rowGap={5}>
              <FormControl isRequired={true} isInvalid={!!errors.cage_id}>
                <FormLabel>Jaula</FormLabel>
                <Select
                  id="cage"
                  placeholder="Seleccione una jaula"
                  {...register("cage_id", {
                    required: "Este campo es requerido",
                  })}
                >
                  {cagesOptionsList.map((cage) => (
                    <option key={cage.id} value={cage.id}>
                      {cage.code}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.cage_id && errors.cage_id.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>Descripción</FormLabel>
                <Textarea data-key="code" placeholder="Información adicional" {...register("description")} />
              </FormControl>
            </Box>
          </Box>
        </SimpleGrid>
        <Divider />
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={5}>
          <Box display="flex" flexDir="column" rowGap={5}>
            <FormControl>
              <FormLabel>Fecha del empadre</FormLabel>
              <Controller
                name="date"
                control={control}
                rules={{ required: "La fecha de nacimiento es obligatoria" }}
                render={({field}) => (
                  <DatePicker 
                    {...field}
                    onChange={(date) => {
                      setValue("date", date ? date : new Date());
                      trigger("date");
                    }}
                    value={field.value ? getFormattedDate(field.value.getTime(), false) : ""}
                    todayButton="Hoy"
                    placeholderText="Ingresa la fecha"
                    maxDate={new Date()}
                    customInput={
                      <Input data-key="code"/>
                    }
                  />
                )}
              />
            </FormControl>
          </Box>
          <Box display="flex" flexDir="column" rowGap={5} >
            <FormControl display='flex' justifyContent='center' flexDir="column" gap={3}>
              <FormLabel htmlFor='continuous_breeding' mb='0'>
                Empadre Continuo
              </FormLabel>
              <Switch {...register('continuous_breeding')} id='continuous_breeding' />
            </FormControl>
          </Box>
        </SimpleGrid>
      </FormProvider>
    </SimpleGrid>
  );
}

export default BreedingEventForm;
