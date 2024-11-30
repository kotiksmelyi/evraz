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
import { useGetReport, useUploadFile } from '@shared/server/http';
import Lottie from 'lottie-react';
import animation from './animation.json';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState<RcFile[]>([]);
  const [numPages, setNumPages] = useState<number>();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

  const { mutate: fetchUpload, data: reportId, isPending: isUploadFilePending } = useUploadFile();
  const { data: reportData, isPending: isReportLoading, refetch: requestReport } = useGetReport(reportId);

  console.log({ uploadedFiles, reportId, isUploadFilePending, reportData, isReportLoading });

  const handleSend = () => {
    if (uploadedFiles.length) {
      fetchUpload(uploadedFiles[0], {
        onSuccess: (id) => requestReport(id),
      });
    }
  };

  const handleDownloadPDF = () => {
    try {
      const fileUrl = URL.createObjectURL(reportData);

      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = `${uploadedFiles[0].name.split('.')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(fileUrl);
        document.body.removeChild(link);
      }, 1000);
    } catch (error) {
      console.error('Ошибка при загрузке PDF:', error);
    }
  };

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
  console.log(new Array(numPages));

  return (
    <ThemeProvider>
      <Layout className="main-layout">
        <Content>
          <Flex vertical align="center">
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
                <Button disabled={!reportData || !uploadedFiles.length} onClick={handleDownloadPDF}>
                  Скачать pdf
                </Button>
              </Flex>
            </Flex>
            {(isUploadFilePending || isReportLoading) && (
              <div className={'loading-container'}>
                <Lottie animationData={animation} loop={true} />;
              </div>
            )}
            {reportData && (
              <Document file={reportData} onLoadSuccess={onDocumentLoadSuccess}>
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
            )}
          </Flex>
        </Content>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
