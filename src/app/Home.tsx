import { Button, Flex, Layout, message, Tabs, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { RcFile, UploadFile } from 'antd/es/upload';
import { DownloadOutlined } from '@ant-design/icons';
import { Content } from 'antd/es/layout/layout';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { useGetReport, useGetReportJSON, useUploadFile } from '@shared/server/http';
import Lottie from 'lottie-react';
import animation from './animation.json';
import city from '../shared/assets/mock-images/city.png';
import border from './border.json';
import Logo from '../shared/assets/logo.svg?react';
import { CheckOutlined } from '@ant-design/icons';
import useWindowSize from '@shared/hooks/useWindowSize';
import ReactECharts from 'echarts-for-react';
import { useNavigate, useParams } from 'react-router-dom';
import { CodeBlock, CopyBlock, dracula } from 'react-code-blocks';

interface Report {
  titles: string[];
  code_comments: Codecomment[];
  project_comments: Projectcomment[];
}

interface Projectcomment {
  title: string;
  comment: string;
}

interface Codecomment {
  title: string;
  start_string_number: number;
  end_string_number: number;
  filepath: string;
  comment: string;
  suggestion: null | string;
  lines: { order: number; text: string }[];
}

interface ReviewDataTransformed {
  title: string;
  content: (Codecomment | Projectcomment)[];
}

export const Home = () => {
  const [uploadedFiles, setUploadedFiles] = useState<RcFile[]>([]);
  const [numPages, setNumPages] = useState<number>();
  const { width } = useWindowSize();
  const [widthState, setWidthState] = useState<number>(width);
  const [tab, setTab] = useState(1);
  const params = useParams();
  const navigate = useNavigate();
  const [reviewTransform, setReviewTransform] = useState<ReviewDataTransformed[] | null>(null);
  const [chart, setChart] = useState<'Pie' | 'Bar'>('Pie');
  const colors = ['#0088CC', '#FBB92F', '#EE7918', '#9FEBB1', '#E42213'];
  const [id, setId] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

  const { mutate: fetchUpload } = useUploadFile();
  const { data: reportData, isLoading: isReportLoading, refetch: requestReport } = useGetReport(id);
  const { data: review, refetch: requestReview } = useGetReportJSON(id);

  const handleSend = () => {
    if (uploadedFiles.length) {
      fetchUpload(uploadedFiles[0], {
        onSuccess: (id) => {
          setId(id);
          getData();
          navigate(`/${id}`);
        },
      });
    }
  };

  const getData = async () => {
    if (id) {
      requestReport();
      requestReview();
    }
  };

  useEffect(() => {
    if (params.id) {
      setId(params.id);
    }
  }, [params.id]);

  const transormFunc = (data: Report) => {
    const result = data.titles.map((e) => ({ title: e, content: [] as (Codecomment | Projectcomment)[] }));
    data.code_comments.forEach((el) => {
      const index = result.findIndex((e) => e.title === el.title);
      result[index].content.push(el);
    });
    data.project_comments.forEach((el) => {
      const index = result.findIndex((e) => e.title === el.title);
      result[index].content.push(el);
    });
    result && setReviewTransform(result);
  };

  useEffect(() => {
    if (review) {
      transormFunc(review);
    }
  }, [review]);

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

  const PieOptions = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      orient: 'vertical',
      left: 'left',
    },
    series: [
      {
        name: 'Замечания',
        type: 'pie',
        radius: '50%',
        data: reviewTransform?.map((e) => ({ value: e.content.length, name: e.title })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        color: colors,
      },
    ],
  };

  const BarOptions = {
    xAxis: {
      max: 'dataMax',
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'category',
      data: reviewTransform?.map((e) => e.title),
      inverse: true,
      splitLine: {
        show: false,
      },
    },
    grid: {
      left: '200px',
      show: false,
    },
    series: [
      {
        name: 'Замечания',
        type: 'bar',
        data: reviewTransform?.map((e) => ({ value: e.content.length, name: e.title })),
        label: {
          show: true,
          position: 'right',
        },
        barWidth: '30%',
        color: colors,
      },
    ],
    tooltip: {
      trigger: 'item',
    },
  };
  return (
    <Layout className="main-layout">
      <img src={city} alt="city" className="background" />
      <header>
        <Logo />
      </header>
      <Content>
        <Flex vertical align="center" gap="middle">
          <Flex gap="middle" align="center" className="upload-widget">
            <Flex vertical align="center" gap="large" className="instructions">
              <p>
                <CheckOutlined /> Загрузите файл или ZIP-архив
              </p>
              <p>
                <CheckOutlined /> Нажмите кнопку "Отправить"
              </p>
              <p>
                <CheckOutlined /> Вы можете скачать готовый pdf отчёт или просмотреть его ниже.
              </p>
            </Flex>
            <Flex vertical align="center" gap="small">
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
          </Flex>
          {isReportLoading && (
            <div className={'loading-container'}>
              <Lottie animationData={animation} loop={true} />
            </div>
          )}
          {reportData && (
            <Tabs
              defaultActiveKey="1"
              items={[
                { label: 'PDF-отчёт', key: '1' },
                { label: 'Ревью', key: '2' },
              ]}
              onChange={(key) => setTab(Number(key))}
            />
          )}
          {/*1tab*/}
          {tab === 1 && (
            <div>
              {reportData && (
                <div style={{ overflowX: 'scroll', overflowY: 'hidden', padding: '16px', width: `${width}px` }}>
                  <Flex gap={'small'} className="buttons">
                    <Button type="primary" onClick={() => setWidthState((prev) => prev + 100)}>
                      +
                    </Button>
                    <Button type="primary" onClick={() => setWidthState((prev) => prev - 100)}>
                      -
                    </Button>
                  </Flex>
                  <Document file={reportData} onLoadSuccess={onDocumentLoadSuccess} className={'pdf-container'}>
                    {Array.from(new Array(numPages), (_, index) => (
                      <Page
                        noData={<></>}
                        loading={<></>}
                        error={<></>}
                        width={widthState}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                      />
                    ))}
                  </Document>
                </div>
              )}
            </div>
          )}
          {tab === 2 && (
            <div className="report-review">
              <h1>Анализ и статистика по проекту</h1>
              <div className="overview">
                <Flex align="center" gap={'small'}>
                  <svg
                    className="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="#00141f"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544.356.35.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.868 1.868 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331ZM7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2h-8Zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2H7.556Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <p className="medium">
                    Замечаний:{' '}
                    <span className="bold" id="total">
                      {reviewTransform?.reduce((acc, item) => acc + item.content.length, 0)}
                    </span>
                  </p>
                </Flex>
                <Button
                  type="primary"
                  onClick={() => setChart((prev) => (prev === 'Pie' ? 'Bar' : 'Pie'))}
                  style={{ marginTop: '24px' }}
                >
                  Переключить на {chart === 'Pie' ? 'Bar' : 'Pie'} чарт
                </Button>
                {chart === 'Pie' && (
                  <ReactECharts
                    option={PieOptions}
                    style={{ height: '500px', width: '100%', maxWidth: '500px', marginTop: '24px' }}
                  />
                )}
                {chart === 'Bar' && (
                  <ReactECharts
                    option={BarOptions}
                    style={{ height: '500px', width: '100%', maxWidth: '500px', marginTop: '24px' }}
                  />
                )}
                <div style={{ marginTop: '-100px' }}>
                  {reviewTransform?.map((e) => (
                    <div className="comment-container" key={e.title}>
                      <h3>{e.title}</h3>
                      {e.content.map((el) => {
                        if ('filepath' in el && !!el.filepath) {
                          return (
                            <div className="flex column comment-code">
                              <div className="flex align-center" style={{ marginBottom: '24px' }}>
                                <svg
                                  className="w-6 h-6 text-gray-800 dark:text-white"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"
                                  />
                                </svg>
                                <p className="medium">..{el.filepath}</p>
                              </div>
                              <div className="comment-container-blue flex">
                                <div style={{ width: '24px', marginRight: '8px' }}>
                                  <svg
                                    className="w-6 h-6 text-gray-800 dark:text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      stroke="#00141f"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="2"
                                      d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                    />
                                  </svg>
                                </div>
                                <p style={{ marginTop: '2px' }}>{el.comment}</p>
                              </div>
                              <div className="code">
                                <CodeBlock
                                  text={el.lines
                                    .map((line) => line.text)
                                    .join('\n')
                                    .replace(/\n/g, '\n \t')
                                    .replace(/```python/g, '')
                                    .replace(/```/g, '')}
                                  language="python"
                                  theme={dracula}
                                  //style={{ whiteSpace: 'pre-line' }}
                                ></CodeBlock>
                              </div>
                              {el.suggestion && <p>Предложенные изменения</p>}
                              {el.suggestion && (
                                <div className="code-green">
                                  <CopyBlock
                                    text={el.suggestion
                                      .replace(/\n/g, '\n \t')
                                      .replace(/```python/g, '')
                                      .replace(/```/g, '')}
                                    language="python"
                                    theme={dracula}
									showLineNumbers
                                    //style={{ whiteSpace: 'pre-line' }}
                                  ></CopyBlock>
                                </div>
                              )}
                            </div>
                          );
                        } else
                          return (
                            <div className="comment-container flex" style={{ breakAfter: 'page' }}>
                              <div style={{ width: '24px', marginRight: '8px' }}>
                                <svg
                                  className="w-6 h-6 text-gray-800 dark:text-white"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    stroke="#00141f"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                  />
                                </svg>
                              </div>
                              <p style={{ marginTop: '2px' }}>{el.comment}</p>
                            </div>
                          );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Flex>
      </Content>
      <div className="animated-border">
        <Lottie animationData={border} loop={true} />
      </div>
      <div className="animated-border">
        <Lottie animationData={border} loop={true} />
      </div>
      <div className="animated-border">
        <Lottie animationData={border} loop={true} />
      </div>
    </Layout>
  );
};
