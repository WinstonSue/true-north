# Customize tooltip

## Source

```tsx
import React from 'react';
import type { SliderSingleProps } from '@sue/design-web-react';
import { Slider } from '@sue/design-web-react';

const formatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (value) => `${value}%`;

const App: React.FC = () => (
  <>
    <Slider tooltip={{ formatter }} />
    <Slider tooltip={{ formatter: null }} />
  </>
);

export default App;
```
