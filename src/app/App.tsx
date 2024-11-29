import { queryClient } from '@shared/server/queryCLient';
import { QueryClientProvider } from '@tanstack/react-query';
import './locale';
import './styles/App.scss';
import { ThemeProvider } from './theme';
import { Button, Flex, Layout, message, Upload } from 'antd';
import { useState } from 'react';
import { RcFile, UploadFile } from 'antd/es/upload';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState<RcFile[]>([]);

  const handleSend = () => null;
  const handleDownload = () => null;

  const handleBeforeUpload = (file: RcFile) => {
    if (uploadedFiles.length === 1) {
      message.error(`Тихо-тихо, по одному`);
      return Upload.LIST_IGNORE;
    }

    const isZipOrFile =
      file.type === 'application/zip' ||
      file.type === 'application/x-zip-compressed' ||
      file.type === 'application/octet-stream' ||
      file.type.startsWith('text/') ||
      file.type.startsWith('application/');

    if (!isZipOrFile) {
      message.error(`${file.name} не поддерживается. Загрузите файл или ZIP-архив.`);
      return Upload.LIST_IGNORE;
    }

    setUploadedFiles((prevFiles) => [...prevFiles, file]);
    return false;
  };

  const handleRemove = (file: UploadFile) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((prevFile) => prevFile.uid !== file.uid));
    message.success(`${file.name} удален.`);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Layout style={{ height: '100%' }} className="main-layout">
          <Flex gap="small">
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={true}
              onRemove={handleRemove}
              multiple={false}
              beforeUpload={handleBeforeUpload}
            >
              Upload
            </Upload>
          </Flex>

          <Flex gap="small">
            <Button disabled={!uploadedFiles.length} onClick={handleSend}>
              Отправить
            </Button>
            <Button disabled onClick={handleDownload}>
              Скачать pdf
            </Button>
          </Flex>
        </Layout>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
