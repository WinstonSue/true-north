#  semantic

## Source

```tsx
import React from 'react'
import { Cascader } from '@sue/design-web-react'
import SemanticPreview from '@/components/SemanticPreview'
import useLocale from '@/hooks/useLocale'

const locales = {
  cn: {
    root: '根元素，包含级联选择器的容器样式',
  },
  en: {
    root: 'Root element for Cascader container styles',
  },
}

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{ value: 'hangzhou', label: 'Hangzhou' }],
  },
]

const App: React.FC = () => {
  const [locale] = useLocale(locales)
  return (
    <SemanticPreview
      componentName="Cascader"
      semantics={[{ name: 'root', desc: locale.root, version: '5.0.0' }]}
    >
      <Cascader style={{ width: 300 }} options={options} placeholder="Please select" />
    </SemanticPreview>
  )
}

export default App
```
