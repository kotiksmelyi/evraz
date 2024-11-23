import { FC } from 'react';
import './language-item.styles.scss';
type Props = {
  flag: string;
  name: string;
  onClick?: () => void;
};
export const LanguageItem: FC<Props> = ({ flag, name, onClick }) => {
  return (
    <div onClick={onClick} className="language-item">
      <img className="language-item-flag" src={flag} />
      <span>{name}</span>
    </div>
  );
};
