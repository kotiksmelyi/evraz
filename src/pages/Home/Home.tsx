import Footer from '@shared/components/footer/footer';
import Header from '@shared/components/header/header';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { FC } from 'react';

const Home: FC = () => {
  return <div><Layout><Header /><Content>dddd</Content><Footer /></Layout></div>;
};

export default Home;
