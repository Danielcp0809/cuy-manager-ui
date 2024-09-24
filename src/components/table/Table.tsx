import {
  Box,
  Flex,
  IconButton,
  Link,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import "./Table.css";
import React, { useMemo } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import Card from "../card/Card";
import { ITableColumn } from "../../interfaces/table-columns.interface";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { getFormattedDate } from "../../shared/utils";

interface TableProps {
  columnsData: ITableColumn[];
  tableData: any;
  title?: string;
  onEditRow?: (data: any) => void;
  onDeleteRow?: (data: any) => void;
}

function RegularTable(props: TableProps) {
  const { columnsData, tableData, title, onEditRow, onDeleteRow } = props;

  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const isRowSticky = (id: string) => {
    const column = columns.find((column) => column.accessor === id);
    return column?.config?.isSticky;
  };

  return (
    <Card
      direction="column"
      w="100%"
      px="0px"
      overflowX={{ sm: "scroll", lg: "hidden" }}
    >
      {title && (
        <Flex
          px="25px"
          justify="space-between"
          mb="10px"
          align="center"
        >
          <Text
            color={textColor}
            fontSize="22px"
            fontWeight="700"
            lineHeight="100%"
          >
            {title}
          </Text>
        </Flex>
      )}
      <Box overflowX={{ sm: "scroll", lg: "hidden" }}>
        <Table {...getTableProps()} variant="simple" color="gray.500" mb="24px">
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <Th
                    {...column.getHeaderProps()}
                    pe="10px"
                    key={index}
                    borderColor={borderColor}
                    className={isRowSticky(column.id) ? "sticky-column" : ""}
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color="gray.400"
                    >
                      {column.render("header")}
                    </Flex>
                  </Th>
                ))}
                {onEditRow || onDeleteRow ? (
                  <Th pe="10px" key={index} borderColor={borderColor}>
                    <Flex
                      justify="space-between"
                      align="center"
                      fontSize={{ sm: "10px", lg: "12px" }}
                      color="gray.400"
                    >
                      Acciones
                    </Flex>
                  </Th>
                ) : null}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {rows.length === 0 ? (
              <Tr>
                <Td
                  colSpan={columns.length + (onEditRow || onDeleteRow ? 1 : 0)}
                  textAlign="center"
                  border="none"
                >
                  <Text color={textColor} fontSize="sm" fontWeight="700">
                    No hay datos disponibles
                  </Text>
                </Td>
              </Tr>
            ) : (
              rows.map((row, index) => {
                prepareRow(row);
                return (
                  <Tr {...row.getRowProps()} key={index}>
                    {row.cells.map((cell: any, index) => {
                      let data;
                      if (
                        cell.column.type === "TEXT" ||
                        cell.column.type === "NUMBER"
                      ) {
                        data = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {cell.value}
                          </Text>
                        );
                      } else if (cell.column.type === "DATE") {
                        data = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {getFormattedDate(cell.value)}
                          </Text>
                        );
                      } else if (cell.column.type === "PROGRESS") {
                        data = (
                          <Flex align="center">
                            <Text
                              me="10px"
                              color={textColor}
                              fontSize="sm"
                              fontWeight="700"
                            >
                              {cell.value}%
                            </Text>
                            <Progress
                              variant="table"
                              colorScheme="brandScheme"
                              h="8px"
                              w="63px"
                              value={cell.value}
                            />
                          </Flex>
                        );
                      } else if (cell.column.type === "CUSTOM") {
                        const getData = cell.column.callbacks?.getData;
                        data = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="700"
                          >
                            {getData
                              ? getData(cell.value, cell.row.original)
                              : cell.value}
                          </Text>
                        );
                      } else if (cell.column.type === "LINK") {
                        const getDataCallback = cell.column.callbacks?.getData;
                        const href = getDataCallback
                          ? getDataCallback(cell.row.original)
                          : cell.value;
                        data = (
                          <Link
                            color="brand.500"
                            fontSize="sm"
                            fontWeight="700"
                            href={href}
                          >
                            {cell.value}
                          </Link>
                        );
                      }
                      return (
                        <Td
                          {...cell.getCellProps()}
                          key={index}
                          fontSize={{ sm: "14px" }}
                          minW={{ sm: "150px", md: "200px", lg: "auto" }}
                          borderColor="transparent"
                          className={
                            isRowSticky(cell.column.id) ? "sticky-column" : ""
                          }
                        >
                          {data}
                        </Td>
                      );
                    })}
                    {props.onEditRow || props.onDeleteRow ? (
                      <Td
                        fontSize={{ sm: "14px" }}
                        minW={{ sm: "150px", md: "200px", lg: "auto" }}
                        borderColor="transparent"
                      >
                        <Box>
                          {onEditRow && (
                            <Tooltip label="Editar">
                              <IconButton
                                aria-label="Edit"
                                icon={<MdEdit />}
                                size="sm"
                                mr="10px"
                                onClick={() =>
                                  onEditRow && onEditRow(row.original)
                                }
                              />
                            </Tooltip>
                          )}
                          {onDeleteRow && (
                            <Tooltip label="Eliminar">
                              <IconButton
                                aria-label="Delete"
                                icon={<MdDeleteForever />}
                                colorScheme="red"
                                size="sm"
                                onClick={() =>
                                  onDeleteRow && onDeleteRow(row.original)
                                }
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </Td>
                    ) : null}
                  </Tr>
                );
              })
            )}
          </Tbody>
        </Table>
      </Box>
    </Card>
  );
}

export default RegularTable;
