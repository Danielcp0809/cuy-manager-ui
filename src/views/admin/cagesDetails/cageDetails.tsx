import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthApi from "../../../core/hooks/useAuthApi";
import { Box, Text, Spinner } from "@chakra-ui/react";

const CageDetails = () => {
  const { id } = useParams<{ id: string }>();
  const authApi = useAuthApi();
  const [cageDetails, setCageDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCageDetails = async () => {
      try {
        const response = await authApi.get(`/cages/${id}`);
        setCageDetails(response.data);
      } catch (error) {
        console.error("Error fetching cage details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCageDetails();
  }, [id, authApi]);

  if (loading) {
    return <Spinner />;
  }

  if (!cageDetails) {
    return <Text>No se encontraron detalles para la jaula con código {id}</Text>;
  }

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold">Detalles de la Jaula</Text>
      <Text>Código: {cageDetails.code}</Text>
      <Text>Capacidad: {cageDetails.capacity}</Text>
      {/* Agrega más detalles según sea necesario */}
    </Box>
  );
};

export default CageDetails;