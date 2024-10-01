import React, { useEffect } from "react";
import Card from "../../../../components/card/Card";
import {
  Box,
  Flex,
  SimpleGrid,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import PieChart from "../../../../components/charts/PieChart";
import VSeparator from "../../../../components/separators/VSeparator";
import useAuthApi from "../../../../core/hooks/useAuthApi";
import { ICategoriesChartProps } from "../../../../interfaces/api/dashboard.interface";

interface CategoriesChartProps {
  [x: string]: any;
}

export const pieChartOptions = {
  labels: [], // to be filled,
  colors: [], // to be filled
  chart: {
    width: "50px",
  },
  states: {
    hover: {
      filter: {
        type: "none",
      },
    },
  },
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  hover: { mode: null },
  plotOptions: {
    donut: {
      expandOnClick: false,
      donut: {
        labels: {
          show: false,
        },
      },
    },
  },
  tooltip: {
    enabled: true,
    theme: "dark",
  },
};

export const pieChartData = [63, 25, 12];

function CategoriesChart(props: CategoriesChartProps) {
  const { ...rest } = props;
  const authApi = useAuthApi();
  const [chartData, setChartData] = React.useState<any>([]);
  const [chartOptions, setChartOptions] = React.useState<any>(pieChartOptions);
  const [categories, setCategories] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    setLoading(true);
    const getData = async () => {
      try {
        const response = await authApi.get("/dashboard/categories", {
          signal: controller.signal,
        });
        const categories = response.data as ICategoriesChartProps[];
        console.log("🚀 ~ getData ~ categories:", categories)

        const data = categories.map((category: any) => category.total);
        console.log("🚀 ~ getData ~ data:", data)

        const labels = categories.map((category: any) => category.label);
        console.log("🚀 ~ getData ~ labels:", labels)

        if (isMounted) {
          setChartData(data);
          setChartOptions({
            ...chartOptions,
            labels: labels,
            colors: categories.map((category: any) => category.color),
          });
          setCategories(categories);
          setLoading(false);
        }
      } catch (error: any) {
        if (error.code === "ERR_CANCELED") return;
        setLoading(false);
      }
    };
    getData();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [authApi]);

  // theme values
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const cardColor = useColorModeValue("white", "navy.700");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  const getColumnNumber = (maxNumber: number) => {
    if (categories.length === 0) return 1;
    return categories.length > maxNumber ? maxNumber : categories.length;
  };

  const categoryInfo = (color: string, name: string, value: string) => {
    return (
      <Flex direction="column" py="5px">
        <Flex align="center">
          <Box h="8px" w="8px" bg={color} borderRadius="50%" me="4px" />
          <Text
            fontSize="xs"
            color="secondaryGray.600"
            fontWeight="700"
            mb="5px"
          >
            {name}
          </Text>
        </Flex>
        <Text fontSize="lg" color={textColor} fontWeight="700">
          {value}
        </Text>
      </Flex>
    );
  };

  return (
    <Card p="20px" align="center" direction="column" w="100%" justifyContent="space-between" {...rest}>
      <Flex align="center" w="100%" px="15px" py="10px">
        <Text
          me="auto"
          color={textColor}
          fontSize="xl"
          fontWeight="700"
          lineHeight="100%"
        >
          Categorias
        </Text>
      </Flex>
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="100%">
          <Spinner size="xl" thickness="5px" color="brand.500" />
        </Flex>
      ) : chartData.length === 0 ? (
        <Flex justifyContent="center" alignItems="center" height="100%">
          <Text>No hay datos para mostrar</Text>
        </Flex>
      ) : (
        <>
          <PieChart
            height="300px"
            width="100%"
            chartData={chartData}
            chartOptions={chartOptions}
          />
          <Card
            bg={cardColor}
            boxShadow={cardShadow}
            w="100%"
            p="15px"
            px="20px"
            mt="15px"
            mx="auto"
          >
            <SimpleGrid
              columns={{
                sm: getColumnNumber(3),
                md: getColumnNumber(4),
                lg: getColumnNumber(5),
              }}
              gap="10px"
            >
              {categories.map((item: any, index: number) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  minW="75px"
                >
                  {categoryInfo(item.color, item.label, item.total)}
                  {index < categories.length - 1 && <VSeparator height="100%" />}
                </Box>
              ))}
            </SimpleGrid>
          </Card>
        </>
      )}
    </Card>
  );
}

export default CategoriesChart;
