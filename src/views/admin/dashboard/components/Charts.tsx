import { SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import CagesChart from './CagesChart';
import CategoriesChart from './CategoriesChart';

interface ChartsPropsInterface {}

function Charts(props: ChartsPropsInterface) {
    return (
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap='20px' mb='20px'>
            <CagesChart />
            <CategoriesChart />
        </SimpleGrid>
    );
}

export default Charts;