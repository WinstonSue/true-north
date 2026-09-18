# Custom semantic dom styling

## Description (en-US)

You can customize the [semantic dom](#semantic-input) style of Input by passing objects/functions through `classes` and `styles`.

## Source

```vue
<script setup lang="ts">
import type { InputOTPProps, InputPasswordProps, InputProps, InputSearchProps, TextAreaProps } from '@sue/design-web-vue'

const classes: InputProps['classes'] = {
  root: 'effect',
}

const stylesFn: InputProps['styles'] = (info) => {
  if (info.props.size === 'medium') {
    return {
      root: {
        borderColor: '#696FC7',
      },
    } satisfies InputProps['styles']
  }
  return {}
}

const stylesFnTextArea: TextAreaProps['styles'] = (info) => {
  if (info.props.showCount) {
    return {
      root: { borderColor: '#BDE3C3' },
      textarea: { resize: 'none' },
      count: { color: '#BDE3C3' },
    } satisfies TextAreaProps['styles']
  }
  return {}
}

const stylesFnPassword: InputPasswordProps['styles'] = (info) => {
  if (info.props.size === 'medium') {
    return {
      root: {
        borderColor: '#F5D3C4',
      },
    } satisfies InputPasswordProps['styles']
  }
  return {}
}

const stylesFnOTP: InputOTPProps['styles'] = (info) => {
  if (info.props.size === 'medium') {
    return {
      input: {
        borderColor: '#6E8CFB',
        width: '32px',
      },
    } satisfies InputOTPProps['styles']
  }
  return {}
}

const stylesFnSearch: InputSearchProps['styles'] = (info) => {
  if (info.props.size === 'large') {
    return {
      root: { color: '#4DA8DA' },
      input: { color: '#4DA8DA', borderColor: '#4DA8DA' },
      prefix: { color: '#4DA8DA' },
      suffix: { color: '#4DA8DA' },
      count: { color: '#4DA8DA' },
      button: {
        root: { color: '#4DA8DA', borderColor: '#4DA8DA' },
        icon: { color: '#4DA8DA' },
      },
    } satisfies InputSearchProps['styles']
  }
  return {}
}
</script>

<template>
  <sue-flex vertical gap="large">
    <sue-input :classes="classes" placeholder="Object" name="input-object" />
    <sue-input :classes="classes" :styles="stylesFn" placeholder="Function" size="medium" name="input-fn" />
    <sue-textarea :classes="classes" :styles="stylesFnTextArea" placeholder="Textarea" show-count name="textarea-fn" />
    <sue-input-password :classes="classes" :styles="stylesFnPassword" placeholder="Password" size="medium" name="password-fn" />
    <sue-input-otp :classes="classes" :styles="stylesFnOTP" size="medium" :length="6" separator="*" name="otp-fn" />
    <sue-input-search :classes="classes" :styles="stylesFnSearch" placeholder="Search" size="large" name="search-fn" />
  </sue-flex>
</template>

<style scoped>
.effect {
  border-width: 1px;
  border-radius: 6px;
  -webkit-transition: box-shadow 0.2s;
  transition: box-shadow 0.2s;
}
.effect:focus-visible {
  border-color: lab(66.128% 0 0);
  box-shadow: 0 0 0 4px color-mix(in oklab, lab(66.128% 0 0) 50%, transparent);
}
.effect:hover {
  border-radius: 1px solid #d9d9d9;
}
</style>
```
