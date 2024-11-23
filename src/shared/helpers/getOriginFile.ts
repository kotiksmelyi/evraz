import { UploadFile } from 'antd';

export const getOriginFile = (file: File | UploadFile): File => {
  if (file instanceof File) {
    return file;
  }
  return file.originFileObj as File;
};
