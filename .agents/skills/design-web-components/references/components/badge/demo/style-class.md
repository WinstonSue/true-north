# Custom semantic dom styling

## Description (en-US)

## Source

```vue
<script setup lang="ts">
const badgeClasses = {
  indicator: 'custom-badge-indicator',
}

const ribbonClasses = {
  root: 'custom-ribbon-root',
}

const badgeStyles = {
  root: {
    borderRadius: '8px',
  },
}

const ribbonStyles = {
  indicator: {
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
}

function badgeStylesFn(info: any) {
  if (info.props.size === 'medium') {
    return {
      indicator: {
        fontSize: '14px',
        backgroundColor: '#696FC7',
      },
    }
  }
  return {}
}

function ribbonStylesFn(info: any) {
  if (info.props.color === '#696FC7') {
    return {
      content: {
        fontWeight: 'bold',
      },
      indicator: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }
  }
  return {}
}
</script>

<template>
  <sue-space size="large" vertical>
    <sue-flex gap="middle">
      <sue-badge size="small" :count="5" :classes="badgeClasses" :styles="badgeStyles">
        <sue-avatar shape="square" size="large" />
      </sue-badge>
      <sue-badge :count="5" :classes="badgeClasses" :styles="badgeStylesFn">
        <sue-avatar shape="square" size="large" />
      </sue-badge>
    </sue-flex>
    <sue-flex vertical gap="middle">
      <sue-badge-ribbon text="Custom Ribbon" :classes="ribbonClasses" :styles="ribbonStyles">
        <sue-card title="Card with custom ribbon" size="small">
          This card has a customized ribbon with semantic classNames and styles.
        </sue-card>
      </sue-badge-ribbon>
      <sue-badge-ribbon
        text="Custom Ribbon"
        color="#696FC7"
        :classes="ribbonClasses"
        :styles="ribbonStylesFn"
      >
        <sue-card title="Card with custom ribbon" size="small">
          This card has a customized ribbon with semantic classNames and styles.
        </sue-card>
      </sue-badge-ribbon>
    </sue-flex>
  </sue-space>
</template>

<style>
.custom-badge-indicator {
  font-size: 10px;
}
.custom-ribbon-root {
  width: 400px;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
}
</style>
```
