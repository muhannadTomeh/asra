const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api"

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "حدث خطأ غير متوقع" }))
    throw new ApiError(err.message || "حدث خطأ غير متوقع", res.status)
  }
  if (res.status === 204) return {} as T
  return res.json()
}

export const api = {
  get: async <T>(path: string): Promise<T> => {
    const res = await fetch(`${API_BASE}${path}`, { credentials: "include" })
    return handleResponse<T>(res)
  },

  post: async <T>(path: string, body?: unknown): Promise<T> => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: body ? JSON.stringify(body) : undefined,
    })
    return handleResponse<T>(res)
  },

  put: async <T>(path: string, body: unknown): Promise<T> => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    })
    return handleResponse<T>(res)
  },

  delete: async <T>(path: string): Promise<T> => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "DELETE",
      credentials: "include",
    })
    return handleResponse<T>(res)
  },
}
