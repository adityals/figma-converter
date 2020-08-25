import React from 'react';
import { Flex, Box, Text, Button, useColorMode } from '@chakra-ui/core';

export default () => {
    const { colorMode, toggleColorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    return (
        <Flex
            bg={isDark ? 'inherit' : 'indianred'}
            w="100%"
            px={5}
            py={4}
            justifyContent="space-between"
            alignItems="center"
        >
            <Flex flexDirection="row" justifyContent="center" alignItems="center">
                <Text pl={3} color={'white'} fontWeight="bold">
                    Figma Converter
                </Text>
            </Flex>
            <Box>
                <Button color="white" borderColor="white" variant="outline" onClick={toggleColorMode}>
                    {isDark ? 'Light' : 'Dark'}
                </Button>
            </Box>
        </Flex>
    );
};
