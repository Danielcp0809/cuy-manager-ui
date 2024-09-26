/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import RegularTable from "../../../components/table/Table";
import { cageColumns } from "./configurations/table.config";
import useAuthApi from "../../../core/hooks/useAuthApi";
import { Box, Flex, Spinner, useDisclosure, Text } from "@chakra-ui/react";
import Header from "./components/Header";
import { ICage } from "../../../interfaces/api/cages.interface";
import useCustomToast from "../../../core/hooks/useToastNotification";
import ConfirmationDialog from "../../../components/confirmationDialog/ConfirmationDialog";

interface cageProps {}

const columnsData = cageColumns;

function Cages(props: cageProps) {
  const authApi = useAuthApi();
  const showNotification = useCustomToast();
  const [tableData, setTableData] = useState([]);
  const [selectedCage, setSelectedCage] = useState<ICage | null>(null);
  const [cageToDelete, setCageToDelete] = useState<ICage | null>(null);
  const [loading, setLoading] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getData = async () => {
      try {
        const response = await getDataCallback(controller);
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
  }, [authApi]);

  const getDataCallback = async (controller: AbortController) => {
    return await authApi.get("/cages", {
      signal: controller.signal,
    });
  };

  const onRefresh = async () => {
    const controller = new AbortController();
    try {
      const response = await getDataCallback(controller);
      setTableData(response.data);
    } catch (error) {
      // console.error(error)
    }
  };

  const onEditRow = (data: ICage) => {
    setSelectedCage(data);
  };

  const onDeleteRow = (data: ICage) => {
    setCageToDelete(data);
    onOpen();
  };

  const onCloseDialog = () => {
    onClose();
    setCageToDelete(null);
  };

  const onConfirmDialog = async () => {
    try {
      await authApi.delete(`/cages/${cageToDelete?.id}`);
      showNotification(
        "Eliminación exitosa",
        "success",
        `La jaula ${cageToDelete?.code} ha sido eliminada`
      );
      setTableData(
        tableData.filter((cage: ICage) => cage.id !== cageToDelete?.id)
      );
      onCloseDialog();
    } catch (error: any) {
      showNotification(
        "Error",
        "error",
        "Ocurrió un error al eliminar la jaula"
      );
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"
        height="100%"
        minH="150px"
      >
        <Spinner size="xl" thickness="5px" color="brand.500" />
      </Flex>
    );
  }

  return (
    <Box display="flex" flexDir="column" rowGap={5}>
      <Header
        onRefresh={onRefresh}
        selectedCage={selectedCage}
        setSelectedCage={setSelectedCage}
      />
      <RegularTable
        columnsData={columnsData}
        tableData={tableData}
        onEditRow={onEditRow}
        onDeleteRow={onDeleteRow}
        noDataText="No se encontraron jaulas"
      />
      <ConfirmationDialog
        isOpen={isOpen}
        onClose={onCloseDialog}
        onConfirm={onConfirmDialog}
        title="Elimina jaula"
        message={
          <Text>
            ¿Está seguro de que desea eliminar la jaula{" "}
            <strong>{cageToDelete?.code}</strong> ? Se eliminarán todos los contadores asociados
          </Text>
        }
      />
    </Box>
  );
}

export default Cages;
