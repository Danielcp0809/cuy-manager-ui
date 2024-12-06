/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { NewPurchaseEventForm } from "../PurchaseEvent";
import { ICageOptions } from "../../../../../../interfaces/cages-options.interface";
import useCustomToast from "../../../../../../core/hooks/useToastNotification";
import useAuthApi from "../../../../../../core/hooks/useAuthApi";
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  SimpleGrid,
  Textarea,
} from "@chakra-ui/react";
import { IoMdAdd } from "react-icons/io";
import { GoDash } from "react-icons/go";
import MaskedInput from "react-text-mask";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import DatePicker from "react-datepicker";
import { getFormattedDate } from "../../../../../../shared/utils";

interface PurchaseEventFormProps {
  useFormInstance: UseFormReturn<NewPurchaseEventForm, any, undefined>;
}

const currencyMask = createNumberMask({
  prefix: "$ ",
  includeThousandsSeparator: true,
  thousandsSeparatorSymbol: ",",
  allowDecimal: true,
  decimalSymbol: ".",
  decimalLimit: 2, // how many digits allowed after the decimal
  integerLimit: 9, // limit length of integer numbers
  allowNegative: false,
  allowLeadingZeroes: false,
});

const weightMask = createNumberMask({
  prefix: "",
  includeThousandsSeparator: false,
  allowDecimal: true,
  decimalSymbol: ".",
  decimalLimit: 2, // how many digits allowed after the decimal
  integerLimit: 9, // limit length of integer numbers
  allowNegative: false,
  allowLeadingZeroes: false,
});

function PurchaseEventForm(props: PurchaseEventFormProps) {
  const { useFormInstance } = props;
  const [cagesOptions, setCageOptions] = React.useState<ICageOptions[]>([]);
  const [cagesOptionsList, setCageOptionsList] = React.useState<
    { id: string; code: string }[]
  >([]);
  const [categoryOptionsList, setCategoryOptionsList] = React.useState<
    { id: string; name: string }[]
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

  // form values watched
  const quantity = watch("quantity");
  const cage = watch("cage_id");
  const category = watch("category_id");

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
    if (!cage) return;
    const selectedCage = cagesOptions.find((c) => c.id === cage);
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
  }, [cage, cagesOptions, setValue]);

  const updateCounter = (action: "increase" | "decrease") => {
    const value = quantity ? Number(quantity) : 0;
    let amount = action === "increase" ? value + 1 : value - 1;
    if (amount < 0) amount = 0;
    setValue("quantity", amount);
    trigger("quantity");
  };

  return (
    <SimpleGrid columns={1} spacing={5}>
      <FormControl isRequired={true}>
        <FormLabel>Jaula de destino</FormLabel>
        <Select
          id="cage"
          isRequired={true}
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
      </FormControl>
      <FormControl isRequired={true} isInvalid={!!errors.category_id}>
        <FormLabel>Categoría</FormLabel>
        <Select
          disabled={!cage}
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
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5}>
        <FormControl isRequired={true} isInvalid={!!errors.quantity}>
          <FormLabel>Cantidad</FormLabel>
          <Box display="flex" gap="5px">
            <Input
              id="quantity"
              type="number"
              isDisabled={!category}
              placeholder="Numero de animales"
              {...register("quantity", {
                min: {
                  value: 1,
                  message: "La cantidad mínima es 1",
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
        <FormControl isRequired={true}>
          <FormLabel>Precio total</FormLabel>
          <Controller
            name="total_price"
            control={control}
            rules={{ required: "Este campo es requerido" }}
            render={({ field }) => (
              <MaskedInput
                {...field}
                mask={currencyMask}
                render={(ref: any, props: any) => (
                  <Input
                    {...props}
                    ref={ref}
                    data-key="price"
                    type="text"
                    placeholder="Precio en dólares"
                  />
                )}
              />
            )}
          />
        </FormControl>
      </SimpleGrid>
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={5}>
        <FormControl isRequired={true}>
          <FormLabel>Peso promedio</FormLabel>
          <Controller
            name="weight"
            control={control}
            rules={{
              required: "Este campo es requerido",
              min: {
                value: 0.1,
                message: "El peso mínimo es 0.1 Kg",
              },
            }}
            render={({ field }) => (
              <MaskedInput
                {...field}
                mask={weightMask}
                render={(ref: any, props: any) => (
                  <InputGroup>
                    <Input
                      {...props}
                      ref={ref}
                      type="text"
                      placeholder="Peso en Kg"
                    />
                    <InputRightElement mr={1}>Kg</InputRightElement>
                  </InputGroup>
                )}
              />
            )}
          />
          <FormErrorMessage>
            {errors.weight && errors.weight.message}
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

export default PurchaseEventForm;
