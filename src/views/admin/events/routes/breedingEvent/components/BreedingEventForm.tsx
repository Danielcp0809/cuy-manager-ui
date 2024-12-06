/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  SimpleGrid,
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
import "./BreedingEventForm.css";
import { getFormattedDate } from "../../../../../../shared/utils";
import { IoMdAdd } from "react-icons/io";
import { GoDash } from "react-icons/go";

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
    watch,
    control,
    register,
    formState: { errors },
    trigger,
    setValue,
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

  // useEffect(() => {
  //   setValue("date", new Date());
  //   trigger("date");
  // }, []);

  const monthsDuration = watch("months_duration");
  const maxMonths = 18;

  const updateCounter = (action: "increase" | "decrease") => {
    const value = monthsDuration ? Number(monthsDuration) : 0;
    let amount = action === "increase" ? value + 1 : value - 1;
    if (amount < 0) amount = 0;
    if (amount > maxMonths) amount = maxMonths;
    setValue("months_duration", amount);
    trigger("months_duration");
  };

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
                <Textarea
                  data-key="code"
                  placeholder="Información adicional"
                  {...register("description")}
                />
              </FormControl>
            </Box>
          </Box>
        </SimpleGrid>
        <Divider />
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={5}>
          <Box display="flex" flexDir="column" rowGap={5}>
            <FormControl width="100%">
              <FormLabel>Fecha del empadre</FormLabel>
              <Controller
                name="date"
                control={control}
                rules={{ required: "La fecha de empadre es obligatoria" }}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    onChange={(date) => {
                      setValue("date", date ? date : new Date());
                      trigger("date");
                    }}
                    value={
                      field.value
                        ? getFormattedDate(field.value.getTime(), false)
                        : ""
                    }
                    todayButton="Hoy"
                    placeholderText="Ingresa la fecha"
                    maxDate={new Date()}
                    customInput={<Input width="100%" />}
                  />
                )}
              />
            </FormControl>
          </Box>
          <Box display="flex" flexDir="column" rowGap={5}>
            <FormControl isRequired={true} isInvalid={!!errors.months_duration}>
              <FormLabel>Meses de duración</FormLabel>
              <Box display="flex" gap="5px">
                <InputGroup>
                  <Input
                    id="months_duration"
                    type="number"
                    placeholder="Meses"
                    max={maxMonths}
                    {...register("months_duration", {
                      min: {
                        value: 1,
                        message: "La cantidad mínima de meses es 1",
                      },
                      max: {
                        value: maxMonths,
                        message: `La cantidad máxima de meses es ${maxMonths}`,
                      },
                    })}
                  />
                  <InputRightElement mr={5}>
                    Meses
                  </InputRightElement>
                </InputGroup>
                <Box display="flex" alignItems="center" gap="5px">
                  <IconButton
                    aria-label="Aumentar contador"
                    onClick={() => updateCounter("increase")}
                    icon={<IoMdAdd />}
                  />
                  <IconButton
                    aria-label="Reducir contador"
                    onClick={() => updateCounter("decrease")}
                    icon={<GoDash />}
                  />
                </Box>
              </Box>
              <FormErrorMessage>
                {errors.months_duration && errors.months_duration.message}
              </FormErrorMessage>
            </FormControl>
          </Box>
        </SimpleGrid>
      </FormProvider>
    </SimpleGrid>
  );
}

export default BreedingEventForm;
