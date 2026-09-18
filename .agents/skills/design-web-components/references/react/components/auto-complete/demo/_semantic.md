#  semantic

## Source

```tsx
import React from 'react'
import { AutoComplete } from '@sue/design-web-react'
import SemanticPreview from '@/components/SemanticPreview'
import useLocale from '@/hooks/useLocale'

const locales = {
  cn: {
    root: '根元素，包含自动完成输入框的容器样式',
  },
  en: {
    root: 'Root element for AutoComplete input container styles',
  },
}

const App: React.FC = () => {
  const [locale] = useLocale(locales)
  return (
    <SemanticPreview
      componentName="AutoComplete"
      semantics={[{ name: 'root', desc: locale.root, version: '5.0.0' }]}
    >
      <AutoComplete
        style={{ width: 300 }}
        options={[{ value: 'Burns Bay Road' }, { value: 'Downing Street' }]}
        placeholder="input here"
      />
    </SemanticPreview>
  )
}

export default App
```
