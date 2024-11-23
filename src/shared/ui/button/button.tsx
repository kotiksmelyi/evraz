import { ButtonProps, Button as ButtonAntD } from 'antd';
import { FC } from 'react';
import './button.styles.scss';
import cn from 'classnames'

const Button: FC<ButtonProps> = ({ className, ...props }) => {
  return <ButtonAntD {...props} className={cn('ui-button', className)} />;
};

export default Button;
