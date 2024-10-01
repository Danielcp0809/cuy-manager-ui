import React from 'react';
// Chakra imports
import {
    Flex,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
    Text,
  } from "@chakra-ui/react";
import Card from './Card';

interface MiniStatisticsProps {
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    name?: string;
    growth?: string;
    value?: string;
}

function MiniStatistics(props: MiniStatisticsProps) {
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const textColorSecondary = "secondaryGray.600";

    const { startContent, endContent, name, growth, value } = props;

    return (
        <Card py='15px'>
        <Flex
          my='auto'
          h='100%'
          align={{ base: "center", xl: "start" }}
          justify={{ base: "center", xl: "center" }}>
          {startContent}
  
          <Stat my='auto' ms={startContent ? "18px" : "0px"}>
            <StatLabel
              lineHeight='100%'
              color={textColorSecondary}
              fontSize={{
                base: "sm",
              }}>
              {name}
            </StatLabel>
            <StatNumber
              color={textColor}
              fontSize={{
                base: "2xl",
              }}>
              {value}
            </StatNumber>
            {growth ? (
              <Flex align='center'>
                <Text color='green.500' fontSize='xs' fontWeight='700' me='5px'>
                  {growth}
                </Text>
                <Text color='secondaryGray.600' fontSize='xs' fontWeight='400'>
                  since last month
                </Text>
              </Flex>
            ) : null}
          </Stat>
          <Flex ms='auto' w='max-content'>
            {endContent}
          </Flex>
        </Flex>
      </Card>
    );
}

export default MiniStatistics;