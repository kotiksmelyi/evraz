import { queryClient } from '@shared/server/queryCLient';
import { QueryClientProvider } from '@tanstack/react-query';
import './locale';
import './styles/App.scss';
import { ThemeProvider } from './theme';
import { Button, Flex, Layout, message, Upload } from 'antd';
import { useState } from 'react';
import { RcFile, UploadFile } from 'antd/es/upload';
import { DownloadOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import kfc from './kfc.pdf';
import { fetchUploadFile } from '@shared/server/http';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState<RcFile[]>([]);
  const [numPages, setNumPages] = useState<number>();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
  const handleSend = () => {
    fetchUploadFile(uploadedFiles[0]);
  };
  const handleDownload = () => null;

  const handleBeforeUpload = (file: RcFile) => {
    if (uploadedFiles.length === 1) {
      message.error(`Вы можете загрузить не более одного файла`);
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
  console.log(new Array(numPages))

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Layout className="main-layout">
          <Content>
            {/*<div className="history">
              <h2>История отчётов</h2>
              <div>
                <p>Отчёт 1</p>
                <p>Отчёт 2</p>
                <p>Отчёт 3</p>
                <p>Отчёт 4</p>
              </div>
            </div>*/}
            <p>Загрузите файл или архив для анализа.</p>
            <Flex vertical>
              <Flex gap="middle" vertical align="center" className="upload-widget">
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={true}
                  onRemove={handleRemove}
                  multiple={false}
                  maxCount={1}
                  beforeUpload={handleBeforeUpload}
                  locale={{}}
                >
                  {uploadedFiles.length ? null : (
                    <Flex vertical align="center" gap={'small'}>
                      <div className="upload-icon">
                        <DownloadOutlined />
                      </div>
                      <p>
                        Перетащите сюда файл
                        <br /> или нажмите, чтобы загрузить
                      </p>
                    </Flex>
                  )}
                </Upload>
                <Flex gap="small">
                  <Button disabled={!uploadedFiles.length} onClick={handleSend} type="primary">
                    Отправить
                  </Button>
                  <Button disabled onClick={handleDownload}>
                    Скачать pdf
                  </Button>
                </Flex>
              </Flex>
              <Document file={kfc} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (_, index) => (
                  <Page
                    noData={<></>}
                    loading={<></>}
                    error={<></>}
                    renderAnnotationLayer={false}
                    renderTextLayer={false}
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                  />
                ))}
              </Document>
            </Flex>
          </Content>
        </Layout>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
