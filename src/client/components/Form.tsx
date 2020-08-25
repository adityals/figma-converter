import React, { ChangeEvent, FC, PropsWithChildren, useState } from 'react';
import { Stack, Input, Button } from '@chakra-ui/core';

type FormProps = {
    isLoading: boolean;
    onClickGenerate: ({}) => {};
};

const Form: FC<PropsWithChildren<FormProps>> = ({ isLoading, onClickGenerate }) => {
    const [formValue, setFormValue] = useState({});

    const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = evt.target;
        setFormValue((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleClickGenerate = () => {
        onClickGenerate(formValue);
    };

    const handleResetState = () => {
        setFormValue({});
    };

    return (
        <Stack spacing={3}>
            <Input name="access_token" variant="filled" placeholder="Access Token" onChange={handleChange} />
            <Input name="key" variant="filled" placeholder="Key" onChange={handleChange} />
            <Input name="node_id" variant="filled" placeholder="Node ID" onChange={handleChange} />
            <Button isLoading={isLoading} onClick={handleClickGenerate}>
                Generate
            </Button>
        </Stack>
    );
};

export default Form;
