import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseApi';
import { API_ROUTES } from '../routes';

// File Types
export interface File {
  id: string;
  originalName: string;
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  type: 'image' | 'video' | 'document' | 'audio' | 'other';
  status: 'uploading' | 'processing' | 'ready' | 'error' | 'deleted';
  folder?: string;
  tags: string[];
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface FileUploadRequest {
  file: File;
  folder?: string;
}

export interface FileUploadResponse {
  file: File;
  message: string;
}

export interface FileListResponse {
  files: File[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FileQueryParams {
  search?: string;
  type?: 'image' | 'video' | 'document' | 'audio' | 'other';
  status?: 'uploading' | 'processing' | 'ready' | 'error' | 'deleted';
  folder?: string;
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'originalName' | 'bytes';
  sortOrder?: 'asc' | 'desc';
}

export const fileApi = createApi({
  reducerPath: 'fileApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['File'],
  endpoints: (builder) => ({
    // Upload file
    uploadFile: builder.mutation<FileUploadResponse, FormData>({
      query: (formData: FormData) => ({
        url: API_ROUTES.FILES.UPLOAD,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['File'],
    }),

    // Get all files
    getFiles: builder.query<FileListResponse, FileQueryParams>({
      query: (params: FileQueryParams) => ({
        url: API_ROUTES.FILES.LIST,
        method: 'GET',
        params,
      }),
      providesTags: ['File'],
    }),

    // Get file by ID
    getFileById: builder.query<File, string>({
      query: (id: string) => ({
        url: API_ROUTES.FILES.BY_ID(id),
        method: 'GET',
      }),
      providesTags: (result: File | undefined, error: unknown, id: string) => [
        { type: 'File', id },
      ],
    }),

    // Delete file
    deleteFile: builder.mutation<{ message: string }, string>({
      query: (id: string) => ({
        url: API_ROUTES.FILES.BY_ID(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['File'],
    }),

    // Bulk delete files
    bulkDeleteFiles: builder.mutation<
      { deleted: number; failed: string[]; message: string },
      { fileIds: string[] }
    >({
      query: (data: { fileIds: string[] }) => ({
        url: API_ROUTES.FILES.BULK_DELETE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['File'],
    }),
  }),
});

export const {
  useUploadFileMutation,
  useGetFilesQuery,
  useGetFileByIdQuery,
  useDeleteFileMutation,
  useBulkDeleteFilesMutation,
} = fileApi;
