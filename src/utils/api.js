const BASE_URL = import.meta.env.VITE_API_URL || (window.location.hostname === "localhost" ? "http://localhost:5000/api" : "/api");

const getHeaders = () => {
  const token = localStorage.getItem("bismart_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const handleResponse = async (res) => {
  if (res.status === 401) {
    localStorage.removeItem("bismart_token");
    window.location.href = "/admin/login";
    throw new Error("Sesi login Anda telah berakhir (expired). Silakan login kembali.");
  }
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const api = {
  get: async (endpoint) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, { headers: getHeaders() });
    return handleResponse(res);
  },
  post: async (endpoint, data) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  put: async (endpoint, data) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  delete: async (endpoint, data) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
      body: data ? JSON.stringify(data) : undefined
    });
    return handleResponse(res);
  }
};
