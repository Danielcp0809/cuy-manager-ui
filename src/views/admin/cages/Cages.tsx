import React, { useEffect, useState } from "react";
import RegularTable from "../../../components/table/Table";
import { cageColumns } from "./configurations/table.config";
import useAuthApi from "../../../core/hooks/useAuthApi";
import { Box } from "@chakra-ui/react";
import Header from "./components/Header";

interface cageProps {}

const columnsData = cageColumns;

function Cages(props: cageProps) {
  const authApi = useAuthApi();
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getData = async () => {
      try {
        const response = await getDataCallback(controller);
        isMounted && setTableData(response.data);
      } catch (error) {
        // console.error(error)
      }
    };
    getData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [authApi]);

  const getDataCallback = async (controller: AbortController) => {
    return await authApi.get("/cages", {
      signal: controller.signal,
    });
  };

  const onRefresh = async () => {
    const controller = new AbortController();
    try {
      const response = await getDataCallback(controller);
      setTableData(response.data);
    } catch (error) {
      // console.error(error)
    }
  };

  return (
    <Box display="flex" flexDir="column" rowGap={5}>
      <Box>
        <Header onRefresh={onRefresh} />
      </Box>
      <RegularTable columnsData={columnsData} tableData={tableData} />
    </Box>
  );
}

export default Cages;
