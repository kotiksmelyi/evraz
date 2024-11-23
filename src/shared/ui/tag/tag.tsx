import { FC } from 'react';
import './tag.styles.scss'

type Props = {
  name: string;
};

const Tag: FC<Props> = ({ ...props }) => {
  return <div className='ui-tag'>{props.name}</div>;
};

export default Tag;
