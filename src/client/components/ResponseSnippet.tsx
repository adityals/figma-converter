import React, { FC, PropsWithChildren } from 'react';
import { Code, useColorMode } from '@chakra-ui/core';

type ResponseProps = {
    response: string;
    width: string;
};

const stylePreEl = { height: '100vh', overflow: 'scroll' };

const ResponseSnippet: FC<PropsWithChildren<ResponseProps>> = ({ response, width }) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';
    return (
        <Code colorScheme={isDark ? 'teal' : 'red'}>
            <pre style={{ ...stylePreEl, width }}>{response || 'Your HTML response will be here!'}</pre>
        </Code>
    );
};

export default ResponseSnippet;
