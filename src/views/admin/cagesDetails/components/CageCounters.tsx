/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { ICage } from "../../../../interfaces/api/cages.interface";
import RegularTable from "../../../../components/table/Table";
import { countersColumns } from "../configurations/counters-table.config";
import { Box, IconButton, Stack, useDisclosure } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import useAuthApi from "../../../../core/hooks/useAuthApi";
import useCustomToast from "../../../../core/hooks/useToastNotification";
import { ICategory } from "../../../../interfaces/api/category.interface";
import CountersForm from "./CountersForm";
import { ICounter } from "../../../../interfaces/api/counters.interface";

interface CageCountersProps {
  cage: ICage;
  onRefresh: () => void;
}

function CageCounters(props: CageCountersProps) {
  const authApi = useAuthApi();
  const showNotification = useCustomToast();
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const [selectedCounter, setSelectedCounter] = React.useState<ICounter | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { cage, onRefresh } = props;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getData = async () => {
      try {
        const response = await authApi.get("/categories", {
          signal: controller.signal,
        });
        isMounted && setCategories(response.data);
      } catch (error: any) {
        if (error.code === "ERR_CANCELED") return;
        showNotification(
          "Error",
          "error",
          "Ocurrió un error al obtener las categorías"
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

  const onEditRow = (counter: ICounter) => {
    setSelectedCounter(counter);
  }

  const onDeleteRow = async (counter: ICounter) => {
    console.log("Delete counter", counter);
  }

  return (
    <Stack spacing={4}>
      <Box>
        <IconButton
          colorScheme="brand"
          aria-label="Crear nueva jaula"
          borderRadius="10px"
          size={"lg"}
          icon={<AddIcon />}
          onClick={onOpen}
        />
        <CountersForm
          cage={cage}
          categories={categories}
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
          onRefresh={onRefresh}
          selectedCounter={selectedCounter}
          setSelectedCounter={setSelectedCounter}
        />
      </Box>
      <RegularTable
        columnsData={countersColumns}
        tableData={cage.counters}
        title="CONTADORES"
        noDataText="No se encontraron contadores"
        onEditRow={onEditRow}
        onDeleteRow={onDeleteRow}
      />
    </Stack>
  );
}

export default CageCounters;
