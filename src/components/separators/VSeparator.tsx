import { Flex } from '@chakra-ui/react';
import React from 'react';

interface VSeparatorProps {
    variant?: 'solid' | 'dashed' | 'dotted';
    children?: React.ReactNode;
    [x: string]: any;
}

function VSeparator(props: VSeparatorProps) {
    const { variant, children, ...rest } = props;
    return <Flex w='1px' bg='rgba(135, 140, 189, 0.3)' {...rest}></Flex>;
}

export default VSeparator;