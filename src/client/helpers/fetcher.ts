export const fetcher = (url: string, headers?: any): Promise<Response> => {
    const req: RequestInit = {
        method: 'GET',
        headers: new Headers({ ...headers, 'Content-Type': 'application/json' }),
    };
    return fetch(`https://api.figma.com/v1${url}`, req);
};
