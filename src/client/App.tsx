import React, { FC } from 'react';
import { hot } from 'react-hot-loader';
import { ChakraProvider, CSSReset } from '@chakra-ui/core';
import theme from '@chakra-ui/theme';
import Navbar from './components/Navbar';
import ConverterPage from './ConverterPage';

const App: FC = () => (
    <ChakraProvider theme={theme}>
        <CSSReset />
        <Navbar />
        <ConverterPage />
    </ChakraProvider>
);

export default hot(module)(App);
