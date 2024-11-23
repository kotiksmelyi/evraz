import EnglishFlag from '@shared/assets/flags/english.png';
import RussianFlag from '@shared/assets/flags/russian.png';
import { LanguageItem } from '@shared/ui/language/language-item';
import { Dropdown, Flex, Layout } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './header.styles.scss';

const Header = () => {
  const { i18n } = useTranslation();

  const languageItems = [
    {
      id: 'ru-RU',
      item: <LanguageItem onClick={() => i18n.changeLanguage('ru-RU')} flag={RussianFlag} name="РУС" />,
    },
    {
      id: 'en-US',
      item: <LanguageItem onClick={() => i18n.changeLanguage('en-US')} flag={EnglishFlag} name="ENG" />,
    },
  ];

  const currentLanguageName = i18n.language as keyof typeof languageItems;
  const currentLanguage = languageItems.find((i) => i.id === currentLanguageName)?.item;
  return (
    <Layout.Header className="ui-header">
      <Flex align="center" justify="space-between" className="h-100">
        <Link to={'/'} className="header-logo">
        </Link>
        <div className="language">
          <Dropdown
            menu={{
              items: languageItems
                .filter((i) => i.id !== currentLanguageName)
                .map((i) => ({ key: i.id, label: i.item })),
            }}
            placement="bottomLeft"
          >
            <a onClick={(e) => e.preventDefault()}>{currentLanguage || languageItems[0].item}</a>
          </Dropdown>
        </div>
      </Flex>
    </Layout.Header>
  );
};

export default Header;
