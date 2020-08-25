import React, { FC, PropsWithChildren } from 'react';
import { Container, Box } from '@chakra-ui/core';

type HTMLViewerProps = {
    htmlString: string;
};
const HTMLViewer: FC<PropsWithChildren<HTMLViewerProps>> = ({ htmlString }) => (
    <Container bgColor="teal">
        <Box bgColor="white">
            <div dangerouslySetInnerHTML={{ __html: htmlString }}></div>
        </Box>
    </Container>
);

export default HTMLViewer;
