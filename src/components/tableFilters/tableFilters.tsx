/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import useAuthApi from "../../core/hooks/useAuthApi";
import useCustomToast from "../../core/hooks/useToastNotification";
import { IoMdAdd } from "react-icons/io";
import { GoDash } from "react-icons/go";

interface IOption {
  value: string;
  label: string;
}

interface tableFiltersProps {
  filterOptionsConfiguration: IFilterOptionConfiguration[];
  filters: IFilterData[];
  setFilters: React.Dispatch<React.SetStateAction<IFilterData[]>>;
}

export interface IFilterData {
  id: string;
  label: string;
  selectedOption: IOption;
}

export interface IFilterOptionConfiguration {
  id: string;
  type: "select" | "text" | "number" | "date";
  label: string;
  options?: IOption[];
  fetchConfig?: {
    method: "get" | "post" | "put" | "delete";
    url: string;
    transformResponse?: (response: any) => IOption[];
  };
}

type NewFilterForm = {
  id: string;
  selectedOption: string;
};

function TableFilters(props: tableFiltersProps) {
  const { filterOptionsConfiguration, filters, setFilters } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    watch,
    register,
    formState: { isValid },
    setValue,
    trigger,
  } = useForm<NewFilterForm>({
    mode: "onChange",
  });
  const selectedFilterId = watch("id");
  const selectedOption = watch("selectedOption");
  const initialRef = React.useRef<HTMLInputElement>(null);
  const [filtersConfiguration, setFiltersConfiguration] = React.useState<
    IFilterOptionConfiguration[]
  >([]);
  const [selectedFilter, setSelectedFilter] =
    React.useState<IFilterOptionConfiguration>();
  const [selectedFilterOptions, setSelectedFilterOptions] = React.useState<
    IOption[]
  >([]);

  const authApi = useAuthApi();
  const showNotification = useCustomToast();

  useEffect(() => {
    setFiltersConfiguration(filterOptionsConfiguration);
  }, [filterOptionsConfiguration]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getData = async () => {
      try {
        // get all options of filters
        const requests = filterOptionsConfiguration.map(async (filter) => {
          if (filter.fetchConfig) {
            const response = await authApi[filter.fetchConfig.method](
              filter.fetchConfig.url,
              {
                signal: controller.signal,
              }
            );
            return filter.fetchConfig.transformResponse
              ? filter.fetchConfig.transformResponse(response)
              : response.data;
          }
          return [];
        });
        const responses = await Promise.all(requests);
        const newFiltersConfiguration = filterOptionsConfiguration.map(
          (filter, index) => {
            if (filter.fetchConfig) {
              return {
                ...filter,
                options: responses[index],
              };
            }
            return filter;
          }
        );
        isMounted && setFiltersConfiguration(newFiltersConfiguration);
      } catch (error: any) {
        if (error.code === "ERR_CANCELED") return;
        showNotification("Error", "error", "Ocurrió un error las opciones");
        console.error(error);
      }
    };
    getData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [authApi, filterOptionsConfiguration]);

  useEffect(() => {
    if (selectedFilterId) {
      const selectedFilter = filtersConfiguration.find(
        (filter) => filter.id === selectedFilterId
      );
      if (selectedFilter) {
        setSelectedFilter(selectedFilter);
        setValue("selectedOption", "");
        if (selectedFilter.type === "select") {
          setSelectedFilterOptions(selectedFilter.options ?? []);
        }
      }
    }
  }, [filtersConfiguration, selectedFilterId]);

  const closeForm = () => {
    onClose();
  };

  const mainColor = useColorModeValue("secondaryGray.500", "white");

  const updateCounter = (action: "increase" | "decrease") => {
    const value = selectedOption ? Number(selectedOption) : 0;
    let amount = action === "increase" ? value + 1 : value - 1;
    if (amount < 0) amount = 0;
    setValue("selectedOption", amount.toString());
    trigger("selectedOption");
  };

  const handleAddFilter = () => {
    // show the forms values
    const formValue = watch();
    const filterConfiguration = filtersConfiguration.find(
      (filter) => filter.id === formValue.id
    );
    const selectedOption =
      filterConfiguration?.type === "select"
        ? filterConfiguration?.options?.find(
            (option) => option.value === formValue.selectedOption
          )
        : { value: formValue.selectedOption, label: formValue.selectedOption };
    const newFilterData: IFilterData = {
      id: formValue.id,
      label: filterConfiguration?.label ?? "",
      selectedOption: selectedOption ?? { value: "", label: "" },
    };
    const newFilterIndex = filters.findIndex(
      (filter) => filter.id === newFilterData.id
    );
    const newFilters = [...filters];
    if (newFilterIndex >= 0) {
      newFilters[newFilterIndex] = newFilterData;
    } else {
      newFilters.push(newFilterData);
    }
    setFilters(newFilters);
    closeForm();
  };

  const handleRemoveFilter = (filterId: string) => {
    const newFilters = filters.filter((filter) => filter.id !== filterId);
    setFilters(newFilters);
  };

  return (
    <Box>
      <HStack spacing={4} wrap="wrap">
        {filters.map((filterData: IFilterData, index: number) => (
          <Tag
            size="lg"
            variant="outline"
            key={index}
            borderRadius="full"
            color={mainColor}
            borderColor={mainColor}
            colorScheme="secondaryGray"
          >
            <TagLabel>
              {filterData.label}:{" "}
              <Text as="span" fontWeight="bold">
                {filterData.selectedOption.label}
              </Text>
            </TagLabel>
            <TagCloseButton
              onClick={() => {
                handleRemoveFilter(filterData.id);
              }}
            />
          </Tag>
        ))}
        <Button colorScheme="secondaryGray" size="sm" onClick={onOpen}>
          Agregar filtros +
        </Button>
      </HStack>
      <Modal
        finalFocusRef={initialRef}
        isOpen={isOpen}
        onClose={closeForm}
        size={"md"}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar filtro</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SimpleGrid columns={1} spacing={4}>
              <FormControl isRequired={true}>
                <FormLabel>Filtro:</FormLabel>
                <Select
                  id="id"
                  isRequired={true}
                  placeholder="Selecciona un filtro"
                  {...register("id", {
                    required: "Este campo es requerido",
                  })}
                >
                  {filtersConfiguration.map(
                    (option: IFilterOptionConfiguration, index: number) => (
                      <option key={index} value={option.id}>
                        {option.label}
                      </option>
                    )
                  )}
                </Select>
              </FormControl>
              {selectedFilter && (
                <FormControl isRequired={true}>
                  <FormLabel>Valor:</FormLabel>
                  {selectedFilter?.type === "select" && (
                    <Select
                      id="value"
                      isRequired={true}
                      placeholder="Selecciona un valor"
                      {...register("selectedOption", {
                        required: "Este campo es requerido",
                      })}
                    >
                      {selectedFilterOptions.map(
                        (option: IOption, index: number) => (
                          <option key={index} value={option.value}>
                            {option.label}
                          </option>
                        )
                      )}
                    </Select>
                  )}
                  {selectedFilter?.type === "text" && (
                    <Input
                      type="text"
                      placeholder="Ingresa un valor del filtro"
                      id="value"
                      {...register("selectedOption", {
                        required: "Este campo es requerido",
                      })}
                    />
                  )}
                  {selectedFilter?.type === "number" && (
                    <Box display="flex" gap="5px">
                      <Input
                        type="number"
                        placeholder="Ingresa un valor del filtro"
                        id="value"
                        {...register("selectedOption", {
                          required: "Este campo es requerido",
                        })}
                      />
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
                  )}
                </FormControl>
              )}
            </SimpleGrid>
          </ModalBody>
          <ModalFooter>
            <Button
              isDisabled={!isValid}
              colorScheme="brand"
              mr={3}
              onClick={handleAddFilter}
            >
              Agregar
            </Button>
            <Button onClick={closeForm}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default TableFilters;
