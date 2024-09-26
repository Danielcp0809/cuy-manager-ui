/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { ICage } from "../../../../interfaces/api/cages.interface";
import RegularTable from "../../../../components/table/Table";
import { countersColumns } from "../configurations/counters-table.config";
import { Box, IconButton, Stack, useDisclosure, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import useAuthApi from "../../../../core/hooks/useAuthApi";
import useCustomToast from "../../../../core/hooks/useToastNotification";
import { ICategory } from "../../../../interfaces/api/category.interface";
import CountersForm from "./CountersForm";
import { ICounter } from "../../../../interfaces/api/counters.interface";
import ConfirmationDialog from "../../../../components/confirmationDialog/ConfirmationDialog";

interface CageCountersProps {
  cage: ICage;
  onRefresh: () => void;
}

function CageCounters(props: CageCountersProps) {
  const authApi = useAuthApi();
  const showNotification = useCustomToast();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCounter, setSelectedCounter] = useState<ICounter | null>(null);
  const [counterToDelete, setCounterToDelete] = useState<ICounter | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenDialog,
    onOpen: onOpenDialog,
    onClose: onCloseDialog,
  } = useDisclosure();
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
  };

  const onDeleteRow = async (counter: ICounter) => {
    setCounterToDelete(counter);
    onOpenDialog();
  };

  const onConfirmDialog = async () => {
    try {
      await authApi.delete(`/counters/${counterToDelete?.id}`);
      showNotification(
        "Eliminación exitosa",
        "success",
        "Contador eliminado correctamente"
      );
      onRefresh();
      onCloseDialog();
    } catch (error: any) {
      showNotification(
        "Error",
        "error",
        "Ocurrió un error al eliminar el contador"
      );
      console.error(error);
    }
  };

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
      <ConfirmationDialog
        isOpen={isOpenDialog}
        onClose={onCloseDialog}
        onConfirm={onConfirmDialog}
        title="Elimina jaula"
        message={
          <Text>
            ¿Estás seguro de eliminar el contador de la categoría{" "}
            <Text as="span" fontWeight="bold">
              {counterToDelete?.category.name}
            </Text>{" "}
            de esta jaula?.
          </Text>
        }
      />
    </Stack>
  );
}

export default CageCounters;
