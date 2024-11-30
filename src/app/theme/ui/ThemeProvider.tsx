import { ConfigProvider } from 'antd';
import { FC, ReactNode } from 'react';
import { colors } from '../../../shared/ui';
import ruRU from 'antd/locale/ru_RU';

type ThemeProviderProps = {
  children: ReactNode;
};

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          fontFamily: 'Montserrat',
          colorPrimary: colors.PRIMARY,
        },
        components: { Layout: { bodyBg: '#e9f8ff' } },
        hashed: false,
      }}
    >
      {children}
    </ConfigProvider>
  );
};
