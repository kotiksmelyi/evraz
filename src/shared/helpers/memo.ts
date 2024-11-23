import { memo as defaultMemo } from 'react';

export const memo: <T>(c: T) => T = defaultMemo;
