import { Card, CardBody, Heading, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";
import "./EventButton.css";
interface EventButtonProps {
  title: string;
  img: string;
  description: string;
}

function EventButton(props: EventButtonProps) {
  const { title, img, description } = props;
  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="elevated"
      padding="10px"
      className="event-card"
      maxHeight={100}
    >
      <Image
        objectFit="cover"
        maxH={{ base: "100%", sm: "100px" }}
        src={img}
        alt={title}
      />

      <Stack>
        <CardBody py={2} px={{base: '10px', lg: '20px'}}>
          <Heading size="md">{title}</Heading>
          <Text lineHeight="15px" fontSize={14} py="2">{description}</Text>
        </CardBody>
      </Stack>
    </Card>
  );
}

export default EventButton;
