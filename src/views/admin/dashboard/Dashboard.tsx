import { Box } from "@chakra-ui/react";
import React from "react";
import Stats from "./components/Stats";
import Charts from "./components/Charts";

interface dashboardProps {}

function Dashboard(props: dashboardProps) {
  return (
    <Box>
        <Stats />
        <Charts />
    </Box>
  );
}

export default Dashboard;
