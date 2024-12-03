import { Card, CardBody, Heading, Image, Stack, Text } from "@chakra-ui/react";
import React from "react";
import "./EventButton.css";
import { useNavigate } from "react-router-dom";
interface EventButtonProps {
  title: string;
  img: string;
  description: string;
  redirect: string;
}

function EventButton(props: EventButtonProps) {
  const { title, img, description, redirect } = props;
  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate(redirect);
  }
  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="elevated"
      padding="10px"
      className="event-card"
      maxHeight={100}
      onClick={handleOnClick}
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
