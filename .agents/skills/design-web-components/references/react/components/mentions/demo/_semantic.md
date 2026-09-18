#  semantic

## Source

```tsx
import React from 'react'
import type { MentionProps } from '@sue/design-web-react'
import { Mentions } from '@sue/design-web-react'
import SemanticPreview from '@/components/SemanticPreview'
import useLocale from '@/hooks/useLocale'

const locales = {
  cn: {
    root: '根元素，设置行内flex布局、相对定位、内边距和边框样式',
    textarea: '文本域元素，设置字体、行高、文本输入和背景样式',
    suffix: '后缀元素，包含后缀内容的布局和样式，如清除按钮等',
  },
  en: {
    root: 'Root element, set inline flex layout, relative positioning, padding and border styles',
    textarea: 'Textarea element, set font, line height, text input and background styles',
    suffix: 'Suffix element with layout and styling for suffix content like clear button, etc.',
  },
}

const Block: React.FC<MentionProps> = (props) => (
  <Mentions
    {...props}
    style={{ width: '100%' }}
    allowClear
    options={[
      { value: 'afc163', label: 'afc163' },
      { value: 'zombieJ', label: 'zombieJ' },
    ]}
  />
)

const App: React.FC = () => {
  const [locale] = useLocale(locales)
  return (
    <SemanticPreview
      componentName="Mentions"
      semantics={[
        { name: 'root', desc: locale.root },
        { name: 'textarea', desc: locale.textarea },
        { name: 'suffix', desc: locale.suffix },
      ]}
    >
      <Block />
    </SemanticPreview>
  )
}

export default App
```
