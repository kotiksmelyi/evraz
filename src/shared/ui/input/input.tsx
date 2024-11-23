import { InputProps, Input as InputAntD } from 'antd';
import { FC } from 'react';
import './input.styles.scss';

const Input: FC<InputProps> = ({ ...props }) => {
  return <InputAntD {...props} className="ui-input" />;
};

export default Input;
