import React, { useState, FC } from 'react';
import { Box, Grid, Image, Tabs, TabList, TabPanels, Tab, TabPanel, useColorMode, useToast } from '@chakra-ui/core';
import Form from './components/Form';
import ResponseSnippet from './components/ResponseSnippet';
import { fetcher } from './helpers/fetcher';
import { convertToHTML } from './helpers/converter';
import HTMLViewer from './components/HTMLViewer';

// for development purpose:
// 58949-516413db-c6f9-4ca6-ac3f-362f65d061d5 - token
// c97HwGcguNcsoKlJsrY7i1 - key
// 827:1671 - node_id
const ConverterPage: FC = () => {
    const toast = useToast();
    const { colorMode } = useColorMode();
    const isDark = colorMode === 'dark';

    const [isLoading, setIsLoading] = useState(false);
    const [thumbnail, setThumbnail] = useState('');
    const [htmlTemplate, setHtmlTemplate] = useState('');

    const handleResetState = () => {
        setThumbnail('');
        setHtmlTemplate('');
    };

    const handleGenerateHTML = async (value: { [key: string]: any }): Promise<void> => {
        handleResetState();
        setIsLoading(true);

        try {
            const key = value.key;
            const nodeId = value.node_id;
            const encodedNodeId = encodeURIComponent(value.node_id);
            const url = `/files/${key}/nodes?ids=${encodedNodeId}`;

            const headers = { 'X-FIGMA-TOKEN': value.access_token };

            const resp = await fetcher(url, headers);
            const body = await resp.json();
            const httpStatus = resp.status;

            if (httpStatus === 200) {
                const thumbnail = body?.thumbnailUrl || '';
                setThumbnail(thumbnail);

                const htmlString = convertToHTML(body, nodeId);
                setHtmlTemplate(htmlString);
            } else {
                toast({
                    title: `HTTP status not ok: ${httpStatus}`,
                    description: JSON.stringify(body),
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (err) {
            toast({
                title: 'Something went wrong',
                description: String(err),
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Tabs colorScheme={isDark ? 'teal' : 'red'} paddingLeft={5} paddingRight={5}>
            <TabList>
                <Tab>API</Tab>
                <Tab>Preview</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    <Grid templateColumns="repeat(2, 1fr)" gap={6} margin={10}>
                        <Box w="100%">
                            <Form isLoading={isLoading} onClickGenerate={handleGenerateHTML} />
                        </Box>
                        <Box w="100%">
                            {thumbnail && (
                                <Box w="100%" marginBottom={10}>
                                    <Image src={thumbnail} />
                                </Box>
                            )}
                            <ResponseSnippet response={htmlTemplate} width="50vw" />
                        </Box>
                    </Grid>
                </TabPanel>
                <TabPanel>
                    {htmlTemplate ? <HTMLViewer htmlString={htmlTemplate} /> : 'HTML file not generated'}
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
};

export default ConverterPage;
