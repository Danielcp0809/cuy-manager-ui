import React from "react";
import { ICage } from "../../../../interfaces/api/cages.interface";
import { Text, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import Information from "../../../../components/information/Information";
import Card from "../../../../components/card/Card";
import { getFormattedDate } from "../../../../shared/utils";

interface cageInformationProps {
  cage: ICage;
}

export default function CageInformation(props: cageInformationProps) {
  const { cage, ...rest } = props;
  // Chakra Color Mode
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const cardShadow = useColorModeValue(
    "0px 18px 40px rgba(112, 144, 176, 0.12)",
    "unset"
  );

  const getTotals = () => {
    return cage.counters.reduce(
        (acc, counter) => acc + (counter.amount ?? 0),
        0
    )
  }

  const getPercentage = () => {
    return ((getTotals() / cage.capacity) * 100).toFixed(1) + "%";
  }

  return (
    <Card mb={{ base: "0px", "2xl": "20px" }} {...rest}>
      <Text
        color={textColorPrimary}
        fontWeight="bold"
        fontSize="2xl"
        mt="10px"
        mb="4px"
      >
        JAULA - {props.cage.code}
      </Text>
      <SimpleGrid minChildWidth="170px" spacing={{base: '20px', sm: "10px"}}>
        <Information
          boxShadow={cardShadow}
          title="Capacidad"
          value={props.cage.capacity}
        />
        <Information
          boxShadow={cardShadow}
          title="Total"
          value={getTotals()}
        />
        <Information
          boxShadow={cardShadow}
          title="Uso"
          value={getPercentage()}
        />
        <Information
          boxShadow={cardShadow}
          title="Fecha de creación"
          value={getFormattedDate(props.cage.created_at)}
        />
        <Information
          boxShadow={cardShadow}
          title="Fecha de actualización"
          value={getFormattedDate(props.cage.updated_at)}
        />
      </SimpleGrid>
    </Card>
  );
}
