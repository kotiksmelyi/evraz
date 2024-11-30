import { RcFile } from 'antd/es/upload';
import axios from 'axios';

// export const BASE_URL = import.meta.env.VITE_API_URL;
export const BASE_URL = 'https://lev-4-ek.ru';

export const api = axios.create({
  baseURL: BASE_URL + '/api/',
});

export async function fetchUploadFile(file: RcFile) {
  try {
    console.log({ file });
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Указываем нужный Content-Type
      },
    });
    const reportId = response.data;
    console.log({ reportId, response });
  } catch (error) {
    console.log({ error });
  }
}

// export async function fetchGetReport(reportId: string) {
//   try {
//     console.log({ file });

//     const response = await api.post(`report/${reportId}`, {
//       file,
//     });
//     console.log({ reportId, response });
//   } catch (error) {
//     console.log({ error });
//   }
// }

// export async function fetchGetReview(file: RcFile) {
//   try {
//     console.log({ file });

//     const response = await api.post(`upload`, {
//       file,
//     });
//     const reportId = response.data;
//     console.log({ reportId, response });
//   } catch (error) {
//     console.log({ error });
//   }
// }
