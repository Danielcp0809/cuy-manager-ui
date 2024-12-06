import { Box, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import EventButton from "./components/EventButton";
import salesEventImg from "../../../assets/img/events/sale-event.png";
import purchaseEventImg from "../../../assets/img/events/purchase-event.png";
import breedingEventImg from "../../../assets/img/events/breeding-event.png";
import deathEventImg from "../../../assets/img/events/death-event.png";
import healthEventImg from "../../../assets/img/events/health-event.png";
import fatteningEventImg from "../../../assets/img/events/fattening-event.png";

interface EventsProps {}

function Events(props: EventsProps) {
  const events = [
    {
      title: "Compra",
      img: salesEventImg,
      redirect: "/admin/eventos/compras",
      description: "Registra la adquisición de cuyes.",
    },
    {
      title: "Venta",
      img: purchaseEventImg,
      redirect: "/admin/eventos/ventas",
      description: "Registra las ventas de cuyes.",
    },
    {
      title: "Empadre",
      img: breedingEventImg,
      redirect: "/admin/eventos/empadres",
      description: "Controla los empadres de cuyes.",
    },
    {
      title: "Muerte",
      img: deathEventImg,
      redirect: "/admin/eventos/muertes",
      description: "Registra las pérdidas por mortalidad.",
    },
    {
      title: "Sanidad",
      img: healthEventImg,
      redirect: "/admin/eventos/sanidades",
      description: "Gestiona eventos sanitarios de los cuyes.",
    },
    {
      title: "Engorde",
      img: fatteningEventImg,
      redirect: "/admin/eventos/engordes",
      description: "Supervisa el engorde de cuyes.",
    },
  ];
  return (
    <Box>
      <SimpleGrid
        columns={{ base: 1, md: 2, xl: 3 }}
        gap={{ base: "10px", md: "20px" }}
        mb="20px"
      >
        {events.map((event, index) => (
          <EventButton
            key={index}
            title={event.title}
            img={event.img}
            description={event.description}
            redirect={event.redirect}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default Events;
