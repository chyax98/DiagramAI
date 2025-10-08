/** API 客户端工具 - 自动添加 Authorization 并处理 401 重定向 */

/** @deprecated 推荐使用 apiClient 对象方法 */
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    throw new Error("未授权，请重新登录");
  }

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.error?.message || errorData.error || errorData.message || errorMessage;
    } catch {
      errorMessage = (await response.text()) || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (data.success === true && data.data !== undefined) {
    return data.data as T;
  }

  return data as T;
}

export const apiClient = {
  async get<T = unknown>(url: string): Promise<T> {
    const response = await authFetch(url);
    return handleResponse<T>(response);
  },

  async post<T = unknown>(url: string, data?: unknown): Promise<T> {
    const response = await authFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse<T>(response);
  },

  async put<T = unknown>(url: string, data?: unknown): Promise<T> {
    const response = await authFetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse<T>(response);
  },

  async patch<T = unknown>(url: string, data?: unknown): Promise<T> {
    const response = await authFetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: data ? JSON.stringify(data) : undefined,
    });
    return handleResponse<T>(response);
  },

  async delete<T = unknown>(url: string): Promise<T> {
    const response = await authFetch(url, {
      method: "DELETE",
    });
    return handleResponse<T>(response);
  },
};
