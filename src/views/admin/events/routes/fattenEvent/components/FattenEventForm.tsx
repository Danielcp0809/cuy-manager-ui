/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { NewFattenEventForm } from "../FattenEvent";
import useCustomToast from "../../../../../../core/hooks/useToastNotification";
import useAuthApi from "../../../../../../core/hooks/useAuthApi";
import { ICageOptions } from "../../../../../../interfaces/cages-options.interface";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Select,
  SimpleGrid,
  Textarea,
} from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import { GoDash } from "react-icons/go";
import DatePicker from "react-datepicker";
import { getFormattedDate } from "../../../../../../shared/utils";

interface FattenEventFormProps {
  useFormInstance: UseFormReturn<NewFattenEventForm, any, undefined>;
}

function FattenEventForm(props: FattenEventFormProps) {
  const { useFormInstance } = props;
  const [cagesOptions, setCageOptions] = React.useState<ICageOptions[]>([]);
  const [cagesOptionsList, setCageOptionsList] = React.useState<
    { id: string; code: string }[]
  >([]);
  const [categoryOptionsList, setCategoryOptionsList] = React.useState<
    { id: string; name: string }[]
  >([]);
  const [maxAnimals, setMaxAnimals] = React.useState<number>(0);

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

  const originCage = watch("origin_cage_id");
  const category = watch("category_id");
  const quantity = watch("quantity");

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
    if (!originCage) return;
    const selectedCage = cagesOptions.find((c) => c.id === originCage);
    if (!selectedCage) return;
    const categoryOptions = selectedCage.counters.map((counter) => {
      return {
        id: counter.category.id,
        name: counter.category.name,
      };
    });
    setValue("category_id", ""); // Reset category when cage changes
    setValue("quantity", 0); // Reset quantity when cage changes
    setCategoryOptionsList(categoryOptions);
  }, [originCage, cagesOptions, setValue]);

  useEffect(() => {
    if (!category) return;
    const selectedCage = cagesOptions.find((c) => c.id === originCage);
    if (!selectedCage) return;
    const selectedCategory = selectedCage.counters.find(
      (counter) => counter.category.id === category
    );
    if (!selectedCategory) return;
    setMaxAnimals(selectedCategory.amount);
    setValue("quantity", undefined);
  }, [category]);

  const updateCounter = (action: "increase" | "decrease") => {
    const value = quantity ? Number(quantity) : 0;
    let amount = action === "increase" ? value + 1 : value - 1;
    if (amount < 0) amount = 0;
    if (amount > maxAnimals) return;
    setValue("quantity", amount);
    trigger("quantity");
  };

  return (
    <SimpleGrid columns={1} spacing={5}>
      <FormControl isRequired={true}>
        <FormLabel>Jaula de origen</FormLabel>
        <Select
          id="origin_cage"
          isRequired={true}
          placeholder="Seleccione una jaula"
          {...register("origin_cage_id", {
            required: "Este campo es requerido",
          })}
        >
          {cagesOptionsList.map((cage) => (
            <option key={cage.id} value={cage.id}>
              {cage.code}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl isRequired={true} isInvalid={!!errors.category_id}>
        <FormLabel>Categoría</FormLabel>
        <Select
          disabled={!originCage}
          placeholder="Selecciona una categoría"
          {...register("category_id", {
            required: "Este campo es requerido",
            validate: (value) =>
              value !== "" || value !== undefined || "Este campo es requerido",
          })}
        >
          {categoryOptionsList.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl isRequired={true}>
        <FormLabel>Jaula de destino</FormLabel>
        <Select
          id="destiny_cage"
          isRequired={true}
          placeholder="Seleccione una jaula"
          {...register("destiny_cage_id", {
            required: "Este campo es requerido",
          })}
        >
          {cagesOptionsList.map((cage) => (
            <option key={cage.id} value={cage.id}>
              {cage.code}
            </option>
          ))}
        </Select>
      </FormControl>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5}>
        <FormControl isRequired={true} isInvalid={!!errors.quantity}>
          <FormLabel>Cantidad</FormLabel>
          <Box display="flex" gap="5px">
            <Input
              id="quantity"
              type="number"
              isDisabled={!category}
              placeholder="Numero de animales"
              max={maxAnimals}
              {...register("quantity", {
                min: {
                  value: 1,
                  message: "La cantidad mínima es 1",
                },
                max: {
                  value: maxAnimals,
                  message: `La cantidad máxima es ${maxAnimals}`,
                },
              })}
            />
            <Box display="flex" alignItems="center" gap="5px">
              <IconButton
                aria-label="Aumentar contador"
                isDisabled={!category}
                onClick={() => updateCounter("increase")}
                icon={<IoMdAdd />}
              />
              <IconButton
                aria-label="Reducir contador"
                isDisabled={!category}
                onClick={() => updateCounter("decrease")}
                icon={<GoDash />}
              />
            </Box>
          </Box>
          <FormErrorMessage>
            {errors.quantity && errors.quantity.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl width="100%">
          <FormLabel>Fecha de la compra</FormLabel>
          <Controller
            name="date"
            control={control}
            rules={{ required: "La fecha de compra es obligatoria" }}
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
      </SimpleGrid>
      <FormControl>
        <FormLabel>Descripción</FormLabel>
        <Textarea
          placeholder="Información adicional"
          {...register("description")}
        />
      </FormControl>
    </SimpleGrid>
  );
}

export default FattenEventForm;
