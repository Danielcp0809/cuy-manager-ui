import React from 'react';
import { Box, useStyleConfig } from "@chakra-ui/react";

interface CardProps {
    variant?: string;
    [key: string]: any;
}

function Card(props: CardProps) {
    const { variant, children, ...rest } = props;
    const styles = useStyleConfig("Card", { variant });
    return (
        <Box __css={styles} {...rest}>
        {children}
      </Box>
    );
}

export default Card;