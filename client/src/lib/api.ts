const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        return { 'Authorization': `Bearer ${token}` };
    }
    return {};
};

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

export const api = {
    get: async (url: string, options: FetchOptions = {}) => {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                ...getAuthHeader(),
            },
        });
        return handleResponse(response);
    },

    post: async (url: string, body: any, options: FetchOptions = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
            ...getAuthHeader(),
        };

        const response = await fetch(url, {
            method: 'POST',
            ...options,
            headers,
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },

    // For file uploads (FormData) - don't set Content-Type
    postFormData: async (url: string, formData: FormData, options: FetchOptions = {}) => {
        const response = await fetch(url, {
            method: 'POST',
            ...options,
            headers: {
                ...options.headers,
                ...getAuthHeader(),
            },
            body: formData,
        });
        return handleResponse(response);
    },

    put: async (url: string, body: any, options: FetchOptions = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
            ...getAuthHeader(),
        };

        const response = await fetch(url, {
            method: 'PUT',
            ...options,
            headers,
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },

    patch: async (url: string, body: any, options: FetchOptions = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
            ...getAuthHeader(),
        };

        const response = await fetch(url, {
            method: 'PATCH',
            ...options,
            headers,
            body: JSON.stringify(body),
        });
        return handleResponse(response);
    },

    delete: async (url: string, options: FetchOptions = {}) => {
        const response = await fetch(url, {
            method: 'DELETE',
            ...options,
            headers: {
                ...options.headers,
                ...getAuthHeader(),
            },
        });
        return handleResponse(response);
    },

    cms: {
        getContent: async (path: string) => {
            const response = await fetch(`/api/cms/content/${path}`, {
                headers: getAuthHeader()
            });
            if (!response.ok) throw new Error(await response.text());
            // Get SHA from header or metadata if the worker returns it
            // For raw content, we might need a separate call to get the SHA if we want to commit
            return response.json();
        },
        updateContent: async (path: string, content: any, message: string, sha?: string) => {
            const response = await fetch(`/api/cms/content/${path}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify({
                    content: JSON.stringify(content, null, 2),
                    message,
                    sha
                })
            });
            return handleResponse(response);
        },
        // We'll also need a way to get the SHA since raw content doesn't provide it
        getMetadata: async (path: string) => {
            const response = await fetch(`/api/cms/metadata/${path}`, {
                headers: getAuthHeader()
            });
            return response.json();
        }
    }
};

const handleResponse = async (response: Response) => {
    // If 401 Unauthorized, maybe logout?
    if (response.status === 401) {
        // Option: trigger a global logout event or redirect
        // localStorage.removeItem('adminAuth');
        // window.location.href = '/admin/login';
    }

    // If 403 Forbidden

    return response;
};
