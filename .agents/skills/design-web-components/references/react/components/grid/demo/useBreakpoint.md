# useBreakpoint Hook

## Source

```tsx
import React from 'react'
import { Tag, useBreakpoint } from '@sue/design-web-react'

const App: React.FC = () => {
  const screens = useBreakpoint()

  return (
    <>
      Current break point:
      {' '}
      {Object.entries(screens)
        .filter(screen => !!screen[1])
        .map(screen => (
          <Tag color="blue" key={screen[0]}>
            {screen[0]}
          </Tag>
        ))}
    </>
  )
}

export default App
```
