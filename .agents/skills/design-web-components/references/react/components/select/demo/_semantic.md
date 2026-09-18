#  semantic

## Source

```tsx
import React from 'react'
import { Select } from '@sue/design-web-react'
import SemanticPreview from '@/components/SemanticPreview'
import useLocale from '@/hooks/useLocale'

const locales = {
  cn: {
    root: '根元素，包含相对定位、行内 flex 布局、光标样式、过渡动画、边框等选择器容器的基础样式',
    suffix: '后缀元素，包含后缀内容的布局和样式，如清除按钮、箭头图标等',
  },
  en: {
    root: 'Root element with relative positioning, inline-flex layout, cursor styles, transitions, border and other basic selector container styles',
    suffix:
      'Suffix element with layout and styling for suffix content like clear button, arrow icon, etc.',
  },
}

const App: React.FC = () => {
  const [locale] = useLocale(locales)
  return (
    <SemanticPreview
      componentName="Select"
      semantics={[
        { name: 'root', desc: locale.root, version: '5.0.0' },
        { name: 'suffix', desc: locale.suffix, version: '5.0.0' },
      ]}
    >
      <Select
        style={{ width: 300 }}
        defaultValue="aojunhao123"
        options={[
          { value: 'aojunhao123', label: 'aojunhao123' },
          { value: 'thinkasany', label: 'thinkasany' },
        ]}
      />
    </SemanticPreview>
  )
}

export default App
```
