/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { categoryColumns } from "./configurations/table.config";
import useAuthApi from "../../../core/hooks/useAuthApi";
import useCustomToast from "../../../core/hooks/useToastNotification";
import { Box, Flex, Spinner, useDisclosure } from "@chakra-ui/react";
import RegularTable from "../../../components/table/Table";
import { ICategory } from "../../../interfaces/api/category.interface";
import CategoriesHeader from "./components/Header";
import { ICage } from "../../../interfaces/api/cages.interface";
import ConfirmationDialog from "../../../components/confirmationDialog/ConfirmationDialog";

interface categoriesProps {}

const columnsData = categoryColumns;

function Categories(props: categoriesProps) {
  const authApi = useAuthApi();
  const showNotification = useCustomToast();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [categoryToDelete, setCategoryToDelete] = useState<ICategory | null>(null);

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
          "Ocurrió un error al obtener las categorías"
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
    return await authApi.get("/categories", {
      signal: controller.signal,
    });
  };

  const onRefresh = async () => {
    const controller = new AbortController();
    setLoading(true);
    try {
      const response = await getDataCallback(controller);
      setLoading(false);
      setTableData(response.data);
    } catch (error) {
      setLoading(false);
      showNotification(
        "Error",
        "error",
        "Ocurrió un error al obtener las categorías"
      );
    }
  };

  const onEditRow = (data: ICategory) => {
    setSelectedCategory(data);
  }

  const onDeleteRow = (data: ICategory) => {
    setCategoryToDelete(data);
    onOpen();
  }

  const onCloseDialog = () => {
    onClose();
    setCategoryToDelete(null);
  }

  const onConfirmDialog = async () => {
    try {
      await authApi.delete(`/categories/${categoryToDelete?.id}`);
      showNotification("Eliminación exitosa", "success", `La categoría ${categoryToDelete?.name} ha sido eliminada`);
      setTableData(tableData.filter((cage: ICage) => cage.id !== categoryToDelete?.id));
      onCloseDialog();
    } catch (error: any) {
      showNotification("Error", "error", "Ocurrió un error al eliminar la categoría");
      console.error(error)
    }
  }


  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100%" minH="150px">
        <Spinner size="xl" thickness="5px" color="brand.500"/>
      </Flex>
    );
  }

  return (
    <Box display="flex" flexDir="column" rowGap={5}>
      <CategoriesHeader onRefresh={onRefresh} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}/>
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
        title="Elimina categoría"
        message={`¿Estás seguro de eliminar la categoría ${categoryToDelete?.name}?. Se eliminarán todos los contadores asociados.`}
      />
    </Box>
  );

}

export default Categories;
