import { useMutation } from '@tanstack/react-query';
import { RcFile } from 'antd/es/upload';
import axios from 'axios';

// export const BASE_URL = import.meta.env.VITE_API_URL;
export const BASE_URL = 'https://lev-4-ek.ru';

export const api = axios.create({
  baseURL: BASE_URL + '/api/',
});

//#region Загрузка файла
export const useUploadFile = () => {
  return useMutation({
    mutationFn: async (file: RcFile) => {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(`upload/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data.report_id;
      } catch (error) {
        console.log({ error });
      }
    },
  });
};
//#endregion

//#region Загрузка отчета PDF файлом
export const useGetReport = () => {
  return useMutation({
    mutationFn: async (reportId: string | null) => {
      if (!reportId) return;
      const response = await api.get(`report/${reportId}`, {
        headers: {
          'Content-Type': 'application/pdf',
        },
      });
      return response.data;
    },
  });
};
//#endregion

//#region Загрузка ревью
export const useGetReview = () => {
  return useMutation({
    mutationFn: async (reportId: string | null) => {
      if (!reportId) return;
      const response = await api.get(`review/${reportId}`);
      return response.data;
    },
  });
};
//#endregion
