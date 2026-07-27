import React from 'react';
import { Select, type SelectProps } from '@sue/design-web-react';

/** Arco InputTag → Sue Select tags mode */
export function InputTag(props: SelectProps) {
  return <Select mode="tags" {...props} />;
}

export default InputTag;
