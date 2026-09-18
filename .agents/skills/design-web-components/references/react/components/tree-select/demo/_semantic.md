#  semantic

## Source

```tsx
import React from 'react'
import { TreeSelect } from '@sue/design-web-react'
import SemanticPreview from '@/components/SemanticPreview'
import useLocale from '@/hooks/useLocale'

const locales = {
  cn: {
    root: '根元素，包含树选择器的容器样式',
  },
  en: {
    root: 'Root element for TreeSelect container styles',
  },
}

const treeData = [
  {
    value: 'parent 1',
    title: 'parent 1',
    children: [
      { value: 'leaf1', title: 'leaf1' },
      { value: 'leaf2', title: 'leaf2' },
    ],
  },
]

const App: React.FC = () => {
  const [locale] = useLocale(locales)
  return (
    <SemanticPreview
      componentName="TreeSelect"
      semantics={[{ name: 'root', desc: locale.root, version: '5.0.0' }]}
    >
      <TreeSelect style={{ width: 300 }} treeData={treeData} placeholder="Please select" />
    </SemanticPreview>
  )
}

export default App
```
