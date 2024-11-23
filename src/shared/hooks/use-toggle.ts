import { useState } from 'react';

export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  const toggle = () => setValue(!value);
  const on = () => setValue(true);
  const off = () => setValue(false);
  return {
    value,
    toggle,
    on,
    off,
    setValue,
  };
};
