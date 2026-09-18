# Prev and next

## Source

```tsx
import React from 'react';
import type { PaginationProps } from '@sue/design-web-react';
import { Pagination } from '@sue/design-web-react';

const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
  if (type === 'prev') {
    return <a>Previous</a>;
  }
  if (type === 'next') {
    return <a>Next</a>;
  }
  return originalElement;
};

const App: React.FC = () => <Pagination total={500} itemRender={itemRender} />;

export default App;
```
