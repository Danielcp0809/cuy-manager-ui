import { Flex } from '@chakra-ui/react';
import React from 'react';

interface HSeparatorProps {
    variant?: 'solid' | 'dashed' | 'dotted';
    children?: React.ReactNode;
    [x: string]: any;
}

function HSeparator(props: HSeparatorProps) {
    const { variant, children, ...rest } = props;
    return <Flex h='1px' w='100%' bg='rgba(135, 140, 189, 0.3)' {...rest}></Flex>;
}

export default HSeparator;