/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Flex, Spinner, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import BarChart from "../../../../components/charts/BarChart";
import Card from "../../../../components/card/Card";
import useAuthApi from "../../../../core/hooks/useAuthApi";
import { ICagesChartProps } from "../../../../interfaces/api/dashboard.interface";

export const barChartOptionsConsumption = {
  chart: {
    stacked: true,
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    style: {
      fontSize: "12px",
      fontFamily: undefined,
    },
    onDatasetHover: {
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
    },
    theme: "dark",
  },
  xaxis: {
    categories: [],
    show: false,
    labels: {
      show: true,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: false,
    color: "black",
    labels: {
      show: false,
      style: {
        colors: "#A3AED0",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
  },

  grid: {
    borderColor: "rgba(163, 174, 208, 0.3)",
    show: true,
    yaxis: {
      lines: {
        show: false,
        opacity: 0.5,
      },
    },
    row: {
      opacity: 0.5,
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    type: "solid",
    colors: [],
  },
  legend: {
    show: false,
  },
  colors: [],
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 10,
      columnWidth: "20px",
    },
  },
};

interface CagesChartProps {}

function CagesChart(props: CagesChartProps) {
  const { ...rest } = props;

  const [chartData, setChartData] = useState<any>([]);
  const [chartOptions, setChartOptions] = useState<any>(
    barChartOptionsConsumption
  );
  const [loading, setLoading] = useState<boolean>(false);
  const authApi = useAuthApi();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    setLoading(true);
    const getData = async () => {
      try {
        const response = await authApi.get("/dashboard/cages", {
          signal: controller.signal,
        });
        const data = response.data as ICagesChartProps;
        const categories = data.categories;
        const labels = data.labels;
        if (isMounted) {
          setChartData(categories);
          setChartOptions({
            ...chartOptions,
            xaxis: {
              ...chartOptions.xaxis,
              categories: labels,
            },
          });
          setLoading(false);
        }
      } catch (error: any) {
        if (isMounted) {
          setLoading(false);
        }
        if (error.code === "ERR_CANCELED") return;
        console.error(error);
      }
    };
    getData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [authApi]);

  // Chakra Color Mode
  const textColor = useColorModeValue("secondaryGray.900", "white");
  return (
    <Card align="center" direction="column" w="100%" {...rest}>
      <Flex align="center" w="100%" px="15px" py="10px">
        <Text
          me="auto"
          color={textColor}
          fontSize="xl"
          fontWeight="700"
          lineHeight="100%"
        >
          Jaulas
        </Text>
      </Flex>
      <Box h="400px" maxH="500px">
        {loading ? (
          <Flex justifyContent="center" alignItems="center" height="100%">
            <Spinner size="xl" thickness="5px" color="brand.500" />
          </Flex>
        ) : chartData.length === 0 ? (
          <Flex justifyContent="center" alignItems="center" height="100%">
            <Text>No hay datos para mostrar</Text>
          </Flex>
        ) : (
          <BarChart chartData={chartData} chartOptions={chartOptions} />
        )}
      </Box>
    </Card>
  );
}

export default CagesChart;
