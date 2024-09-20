import React, { useEffect, useState } from 'react';
import RegularTable from '../../../components/table/Table';
import { cageColumns } from './configurations/table.config';
import useAuthApi from '../../../core/hooks/useAuthApi';

interface cageProps {
}

const columnsData = cageColumns;

function Cages(props: cageProps) {
    const authApi = useAuthApi();
    const [tableData, setTableData] = useState([])
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const getData = async () => {
            try {
                const response = await authApi.get('/cages', {
                    signal: controller.signal
                })
                isMounted && setTableData(response.data)
            } catch (error) {
                // console.error(error)
            }
        }
        getData();

        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [authApi]);

    return (
        <div>
            <RegularTable columnsData={columnsData} tableData={tableData} />
        </div>
    );
}

export default Cages;