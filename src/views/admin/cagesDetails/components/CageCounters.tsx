import React from "react";
import { ICage } from "../../../../interfaces/api/cages.interface";
import RegularTable from "../../../../components/table/Table";
import { countersColumns } from "../configurations/counters-table.config";
import { Box, IconButton, Stack } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

interface CageCountersProps {
  cage: ICage;
}

function CageCounters(props: CageCountersProps) {
  const { cage } = props;
  return (
    <Stack spacing={4}>
      <Box>
        <IconButton
          colorScheme="brand"
          aria-label="Crear nueva jaula"
          borderRadius="10px"
          size={"lg"}
          icon={<AddIcon />}
        />
      </Box>
      <RegularTable
        columnsData={countersColumns}
        tableData={cage.counters}
        title="CONTADORES"
      />
    </Stack>
  );
}

export default CageCounters;
