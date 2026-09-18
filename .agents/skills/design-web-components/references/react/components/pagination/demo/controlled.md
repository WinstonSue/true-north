# Controlled

## Source

```tsx
import React, { useState } from 'react';
import type { PaginationProps } from '@sue/design-web-react';
import { Pagination } from '@sue/design-web-react';

const App: React.FC = () => {
  const [current, setCurrent] = useState(3);

  const onChange: PaginationProps['onChange'] = (page) => {
    console.log(page);
    setCurrent(page);
  };

  return <Pagination current={current} onChange={onChange} total={50} />;
};

export default App;
```
