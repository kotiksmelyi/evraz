import Footer from '@shared/components/footer/footer';
import Header from '@shared/components/header/header';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { FC } from 'react';
import './Home.scss';

const Home: FC = () => {
  return (
    <div>
      <Layout>
        <Header />
        <Content>dddd</Content>
        <div className='kek-div' style={{ backgroundColor: 'red' }}>
          <p>Крутые</p>
          <p>бобры</p>
        </div>
        <Footer />
      </Layout>
    </div>
  );
};

export default Home;
