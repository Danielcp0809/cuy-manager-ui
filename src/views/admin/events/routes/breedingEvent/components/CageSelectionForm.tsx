import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Select,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { GoDash } from "react-icons/go";
import { IoMdAdd } from "react-icons/io";
import { ICageOptions } from "../../../../../../interfaces/cages-options.interface";
import { useFormContext } from "react-hook-form";
import { get } from "lodash";

interface CageSelectionFormProps{
  cages: ICageOptions[];
  prefix: string;
}

function CageSelectionForm(props: CageSelectionFormProps) {
  const { cages, prefix } = props;
  const [cageOptions, setCageOptions] = useState<
    { id: string; code: string }[]
  >([]);
  const [categoryOptions, setCategoryOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [maxAnimals, setMaxAnimals] = useState<number>(0);

  const {
    register,
    watch,
    setValue,
    formState: { errors },
    trigger,
  } = useFormContext();

  const cageFormName = `${prefix}.cage_id`;
  const categoryFormName = `${prefix}.category_id`;
  const quantityFormName = `${prefix}.quantity`;

  const selectedCage = watch(cageFormName);
  const selectedCategory = watch(categoryFormName);
  const quantity = watch(quantityFormName);

  useEffect(() => {
    if (!cages || cages.length === 0) return;
    const cagesOptions = cages.map((cage) => {
      return {
        id: cage.id,
        code: cage.code,
      };
    });
    setCageOptions(cagesOptions);
  }, [cages]);

  useEffect(() => {
    if (!selectedCage) return;
    const cage = cages.find((cage) => cage.id === selectedCage);
    if (!cage) return;
    const categoryOptions = cage.counters.map((counter) => {
      return {
        id: counter.category.id,
        name: counter.category.name,
      };
    });
    setValue(categoryFormName, ""); // Reset category when cage changes
    setValue(quantityFormName, undefined); // Reset quantity when cage changes
    setCategoryOptions(categoryOptions);
  }, [selectedCage, cages, setValue, categoryFormName, trigger, quantityFormName]);

  useEffect(() => {
    if (!selectedCategory) return;
    const cage = cages.find((cage) => cage.id === selectedCage);
    if (!cage) return;
    const category = cage.counters.find(
      (counter) => counter.category.id === selectedCategory
    );
    if (!category) return;
    setMaxAnimals(category.amount);
    setValue(quantityFormName, undefined);
  }, [cages, quantityFormName, selectedCage, selectedCategory, setValue, trigger]);

  const updateCounter = (action: "increase" | "decrease") => {
    const value = quantity ? Number(quantity) : 0;
    let amount = action === "increase" ? value + 1 : value - 1;
    if (amount < 0) amount = 0;
    if (amount > maxAnimals) amount = maxAnimals;
    setValue(quantityFormName, amount);
    trigger(quantityFormName);
  };

  return (
    <Box display="flex" flexDir="column" rowGap={5}>
      <FormControl isRequired={true}>
        <FormLabel>Jaula</FormLabel>
        <Select
          id="cage"
          isRequired={true}
          placeholder="Seleccione una jaula"
          {...register(cageFormName, {
            required: "Este campo es requerido",
          })}
        >
          {cageOptions.map((cage) => (
            <option key={cage.id} value={cage.id}>
              {cage.code}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl isRequired={true} isInvalid={!!get(errors, categoryFormName)}>
        <FormLabel>Categoría</FormLabel>
        <Select
          disabled={!selectedCage}
          placeholder="Selecciona una categoría"
          {...register(categoryFormName, {
            required: "Este campo es requerido",
            validate: (value) => value !== "" || value !== undefined || "Este campo es requerido",
          })}
        >
          {categoryOptions.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormControl >
      <FormControl isRequired={true} isInvalid={!!get(errors, quantityFormName)}>
        <FormLabel>Cantidad</FormLabel>
        <Box display="flex" gap="5px">
          <Input
            id="quantity"
            type="number"
            isDisabled={!selectedCategory}
            placeholder="Numero de animales"
            max={maxAnimals}
            {...register(quantityFormName, {
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
              isDisabled={!selectedCategory}
              onClick={() => updateCounter("increase")}
              icon={<IoMdAdd />}
            />
            <IconButton
              aria-label="Reducir contador"
              isDisabled={!selectedCategory}
              onClick={() => updateCounter("decrease")}
              icon={<GoDash />}
            />
          </Box>
        </Box>
        <FormErrorMessage>
          {String(get(errors, `${quantityFormName}.message`))}
        </FormErrorMessage>
      </FormControl>
    </Box>
  );
}

export default CageSelectionForm;
