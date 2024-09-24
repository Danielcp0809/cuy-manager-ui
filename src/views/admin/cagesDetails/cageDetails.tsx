/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthApi from "../../../core/hooks/useAuthApi";
import { Text, Spinner, Stack, Flex } from "@chakra-ui/react";
import CageInformation from "./components/CageInformation";
import CageCounters from "./components/CageCounters";

const CageDetails = () => {
  const { id } = useParams<{ id: string }>();
  const authApi = useAuthApi();
  const [cageDetails, setCageDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;
    setLoading(true);
    const controller = new AbortController();
    const getData = async () => {
      try {
        const response = await getDataCallback(id, controller);
        isMounted && setCageDetails(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    getData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id, authApi]);

  const getDataCallback = async (id: string, controller: AbortController) => {
    return await authApi.get(`/cages/${id}`, {
      signal: controller.signal,
    });
  };
  
  if (!cageDetails && !loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100%">
        <Text>No se encontraron detalles para de la jaula</Text>
      </Flex>
    );  
  }
  
  if (loading) {
    return (
      <Flex justifyContent="center" alignItems="center" height="100%" minH="150px">
        <Spinner size="xl" thickness="5px" color="brand.500"/>
      </Flex>
    );
  }

  return (
    <Stack spacing={4}>
      <CageInformation cage={cageDetails} />
      <CageCounters cage={cageDetails} />
    </Stack>
  );
};

export default CageDetails;