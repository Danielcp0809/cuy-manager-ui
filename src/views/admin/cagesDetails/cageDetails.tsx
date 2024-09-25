/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthApi from "../../../core/hooks/useAuthApi";
import { Text, Spinner, Stack, Flex } from "@chakra-ui/react";
import CageInformation from "./components/CageInformation";
import CageCounters from "./components/CageCounters";
import useCustomToast from "../../../core/hooks/useToastNotification";

const CageDetails = () => {
  const { id } = useParams<{ id: string }>();
  const authApi = useAuthApi();
  const showNotification = useCustomToast();
  const [cageDetails, setCageDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const controller = new AbortController();
    const getData = async () => {
      try {
        const response = await getDataCallback(id, controller);
        setCageDetails(response.data);
        setLoading(false);
      } catch (error: any) {
        if(error.code === "ERR_CANCELED") return
        showNotification("Error", "error", "Ocurrió un error al obtener los detalles de la jaula");
        setLoading(false);
      }
    };
    getData();

    return () => {
      controller.abort();
    };
  }, [id, authApi]);

  const getDataCallback = async (id: string, controller: AbortController) => {
    return await authApi.get(`/cages/${id}`, {
      signal: controller.signal,
    });
  };

  const onRefresh = async () => {
    if (!id) return;
    const controller = new AbortController();
    setLoading(true);
    try {
      const response = await getDataCallback(id, controller);
      setLoading(false);
      setCageDetails(response.data);
    } catch (error) {
      setLoading(false);
      showNotification(
        "Error",
        "error",
        "Ocurrió un error al obtener los detalles de la jaula"
      );
    }
  }
  
  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100%" minH="150px">
        <Spinner size="xl" thickness="5px" color="brand.500"/>
      </Flex>
    );
  }

  if (!cageDetails) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <Text>No se encontraron detalles para de la jaula</Text>
      </Flex>
    );  
  }

  return (
    <Stack spacing={4}>
      <CageInformation cage={cageDetails} />
      <CageCounters onRefresh={onRefresh} cage={cageDetails} />
    </Stack>
  );
};

export default CageDetails;