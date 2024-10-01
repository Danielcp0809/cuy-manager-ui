import React, { useEffect } from "react";
import { Icon, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import { MdAttachMoney } from "react-icons/md";
import MiniStatistics from "../../../../components/card/MiniStatistics";
import IconBox from "../../../../components/icons/IconBox";
import { FaInbox, FaList, FaTags } from "react-icons/fa";
import useAuthApi from "../../../../core/hooks/useAuthApi";
import { IStatsProps } from "../../../../interfaces/api/dashboard.interface";

interface statsProps {}

const statsInitialState: IStatsProps = {
  cages: 0,
  categories: 0,
  total: 0,
  price: 0,
}

function Stats(props: statsProps) {
  const authApi = useAuthApi();
  const [stats, setStats] = React.useState(statsInitialState);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getStats = async () => {
      try {
        const response = await authApi.get("/dashboard/stats", {
          signal: controller.signal,
        });
        if (isMounted) {
          setStats(response.data);
        }
      } catch (error: any) {
        if (error.code === "ERR_CANCELED") return;
        console.error(error);
      }
    };
    getStats();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [authApi]);
  // theme colors
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  return (
    <SimpleGrid
      columns={{ base: 1, md: 2, lg: 2, "2xl": 4 }}
      gap="20px"
      mb="20px"
    >
      <MiniStatistics
        startContent={
          <IconBox
            w="56px"
            h="56px"
            bg={boxBg}
            icon={
              <Icon w="32px" h="32px" as={FaList} color={brandColor} />
            }
          />
        }
        name="Existencias"
        value={stats.total.toString()}
      />
      <MiniStatistics
        startContent={
          <IconBox
            w="56px"
            h="56px"
            bg={boxBg}
            icon={
              <Icon w="32px" h="32px" as={FaInbox} color={brandColor} />
            }
          />
        }
        name="Jaulas"
        value={stats.cages.toString()}
      />
      <MiniStatistics
        startContent={
          <IconBox
            w="56px"
            h="56px"
            bg={boxBg}
            icon={
              <Icon w="32px" h="32px" as={FaTags} color={brandColor} />
            }
          />
        }
        name="Categorias"
        value={stats.categories.toString()}
      />
      <MiniStatistics
        startContent={
          <IconBox
            w="56px"
            h="56px"
            bg={boxBg}
            icon={
              <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
            }
          />
        }
        name="Precio total"
        value={`$${stats.price}`}
      />
    </SimpleGrid>
  );
}

export default Stats;
