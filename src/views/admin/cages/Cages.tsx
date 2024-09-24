/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import RegularTable from "../../../components/table/Table";
import { cageColumns } from "./configurations/table.config";
import useAuthApi from "../../../core/hooks/useAuthApi";
import { Box } from "@chakra-ui/react";
import Header from "./components/Header";
import { ICage } from "../../../interfaces/api/cages.interface";

interface cageProps {}

const columnsData = cageColumns;

function Cages(props: cageProps) {
  const authApi = useAuthApi();
  const [tableData, setTableData] = useState([]);
  const [selectedCage, setSelectedCage] = useState<ICage | null>(null);

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

  const onEditRow = (data: ICage) => {
    setSelectedCage(data);
  }

  const onDeleteRow = (data: ICage) => {
    console.log("Delete", data);
  }

  return (
    <Box display="flex" flexDir="column" rowGap={5}>
      <Box>
        <Header onRefresh={onRefresh} selectedCage={selectedCage} setSelectedCage={setSelectedCage}/>
      </Box>
      <RegularTable 
        columnsData={columnsData} 
        tableData={tableData} 
        onEditRow={onEditRow} 
        onDeleteRow={onDeleteRow}
      />
    </Box>
  );
}

export default Cages;
