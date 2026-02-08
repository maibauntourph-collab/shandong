const getAuthHeader = () => {
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
