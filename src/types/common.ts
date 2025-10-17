/** 通用类型 - 主题+布局+分页+排序+筛选+异步状态 */

export type Theme = "light" | "dark" | "system";

export type LayoutMode = "compact" | "fullscreen" | "split";

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface SortParams {
  field: string;
  order: "asc" | "desc";
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

export interface Timestamps {
  createdAt: string;
  updatedAt?: string;
}

export interface WithId {
  id: number | string;
}

export type AsyncStatus = "idle" | "loading" | "success" | "error";

export interface AsyncData<T> {
  data: T | null;
  status: AsyncStatus;
  error: string | null;
}
