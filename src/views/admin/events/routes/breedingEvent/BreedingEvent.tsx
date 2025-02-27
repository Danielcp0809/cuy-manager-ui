/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import BreedingEventForm from "./components/BreedingEventForm";
import { Box, useDisclosure } from "@chakra-ui/react";
import Header from "../../components/Header";
import { useForm } from "react-hook-form";
import useCustomToast from "../../../../../core/hooks/useToastNotification";
import useAuthApi from "../../../../../core/hooks/useAuthApi";
import TableFilters, { IFilterData } from "../../../../../components/tableFilters/TableFilters";
import { breedingEventsFiltersConfiguration } from "./configurations/filters.config";
import RegularTable from "../../../../../components/table/Table";
import { breedingEventsTableColumns } from "./configurations/breeding-table.config";

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
  const [filters, setFilters] = React.useState<IFilterData[]>([]);
  const [tableData, setTableData] = React.useState([]);

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
    let isMounted = true;
    const controller = new AbortController();
    const getData = async () => {
      try {
        setLoading(true)
        const response = await getDataCallback(controller, filters);
        isMounted && setTableData(response.data);
        setLoading(false);
      } catch (error: any) {
        if (error.code === "ERR_CANCELED") return;
        showNotification(
          "Error",
          "error",
          "Ocurrió un error al obtener los eventos de empadre"
        );
        setLoading(false);
        console.error(error);
      }
    };
    getData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  },[authApi, filters]);

  const getDataCallback = async (controller: AbortController, filters?: IFilterData[] ) => {
    const params = new URLSearchParams();
    for(const filter of filters || []) {
      params.append(filter.id, filter.selectedOption.value);
    }
    return await authApi.get(`/events/breedings?${params.toString()}`, {
      signal: controller.signal,
    });
  };

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
    await refreshData();
    setLoading(false);
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await getDataCallback(new AbortController(), filters);
      setTableData(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      showNotification("Error", "error", "Ocurrió un error al obtener los eventos de empadre");
    }
  }

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
      date: values.date.getTime(),
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
      <TableFilters 
        filtersConfiguration={breedingEventsFiltersConfiguration}
        filters={filters}
        setFilters={setFilters}
      />
      <RegularTable 
        columnsData={breedingEventsTableColumns}
        tableData={tableData}
        noDataText="No hay eventos de empadre"
        loading={loading}
      />
    </Box>
  );
}

export default BreedingEvent;
