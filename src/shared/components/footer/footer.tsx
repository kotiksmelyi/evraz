import { Flex, Layout } from 'antd';
import './footer.styles.scss'

const Footer = () => {
  return (
    <Layout.Footer className='ui-footer'>
      <Flex align="center" justify="space-between" className='h-100'>
        <div /> 
        <p>© 2024, Крутые Бобры</p>
      </Flex>
    </Layout.Footer>
  );
};

export default Footer;
