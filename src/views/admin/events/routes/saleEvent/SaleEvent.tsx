/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import useAuthApi from "../../../../../core/hooks/useAuthApi";
import { Box, useDisclosure } from "@chakra-ui/react";
import useCustomToast from "../../../../../core/hooks/useToastNotification";
import { useForm } from "react-hook-form";
import Header from "../../components/Header";
import SaleEventForm from "./components/SaleEventForm";
import RegularTable from "../../../../../components/table/Table";
import { salesTableColumns } from "./configurations/sales-table.config";
import TableFilters, { IFilterData } from "../../../../../components/tableFilters/TableFilters";
import { saleEventsFiltersConfiguration } from "./configurations/filters.config";

interface SaleEventProps {}

const columnsData = salesTableColumns;

export type NewSaleEventForm = {
  category_id: string;
  cage_id: string;
  quantity: number | undefined;
  unit_price: number;
  unit_weight: number;
  description: string;
  date: Date;
};

function SaleEvent(props: SaleEventProps) {
  const [loading, setLoading] = React.useState(false);
  const [tableData, setTableData] = React.useState([]);
  const [filters, setFilters] = React.useState<IFilterData[]>([]);
  const showNotification = useCustomToast();
  const formDisclosure = useDisclosure();
  const authApi = useAuthApi();
  const { onClose: onFormClose } = formDisclosure;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getData = async () => {
      try {
        const response = await getDataCallback(controller, filters);
        isMounted && setTableData(response.data);
        setLoading(false);
      } catch (error: any) {
        if (error.code === "ERR_CANCELED") return;
        showNotification(
          "Error",
          "error",
          "Ocurrió un error al obtener las jaulas"
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
  }, [authApi, filters]);

  const getDataCallback = async (controller: AbortController, filters?: IFilterData[] ) => {
    const params = new URLSearchParams();
    for(const filter of filters || []) {
      params.append(filter.id, filter.selectedOption.value);
    }
    return await authApi.get(`/events/sales?${params.toString()}`, {
      signal: controller.signal,
    });
  };

  const useFormInstance = useForm<NewSaleEventForm>({
    mode: "onChange",
    defaultValues: {
      category_id: undefined,
      cage_id: undefined,
      quantity: undefined,
      unit_price: undefined,
      description: undefined,
      date: new Date(),
    },
  });
  const {
    formState: { isValid },
  } = useFormInstance;

  const handleClickSave = async () => {
    try {
      setLoading(true);
      await createNewSaleEvent(useFormInstance.getValues());
      setLoading(false);
      onFormClose();
      onRefresh();
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = async () => {
    const controller = new AbortController();
    try {
      const response = await getDataCallback(controller);
      setTableData(response.data);
    } catch (error) {
      console.error(error)
    }
  };

  const parseFormValues = (data: NewSaleEventForm) => {
    return {
      ...data,
      date: data.date.getTime(),
      unit_price: parseFloat(data.unit_price.toString().replace(/[$,]/g, "")),
    };
  };

  const createNewSaleEvent = async (data: NewSaleEventForm) => {
    try {
      await authApi.post("/events/sale", parseFormValues(data));
      showNotification(
        "Venta creada",
        "success",
        "La venta se creó correctamente"
      );
    } catch (error: any) {
      if (error.code === "ERR_CANCELED") return;
      showNotification("Error", "error", "Ocurrió un error al crear la venta");
      console.error(error);
      setLoading(false);
    }
  };


  return (
    <Box display="flex" flexDir="column" rowGap={5}>
      <Header
        form={<SaleEventForm useFormInstance={useFormInstance} />}
        modalFormSize="md"
        formTitle="Nueva venta"
        formDisclosure={formDisclosure}
        onSaveForm={handleClickSave}
        loading={loading}
        isValid={isValid}
      />
      <TableFilters 
        filterOptionsConfiguration={saleEventsFiltersConfiguration} 
        filters={filters} 
        setFilters={setFilters}
      />
      <RegularTable
        columnsData={columnsData}
        tableData={tableData}
        noDataText="No se encontraron ventas"
      />
    </Box>
  );
}

export default SaleEvent;
