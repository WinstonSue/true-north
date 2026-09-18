# Complex Dynamic Form Item

## Description (en-US)

Complex nested dynamic form items.

## Source

```vue
<script setup lang="ts">
import { X } from '@lucide/vue'
import { reactive } from 'vue'

interface SubItem { first: string, second: string }

interface Item { name: string, list: SubItem[] }

const model = reactive<{ items: Item[] }>({
  items: [
    { name: '', list: [{ first: '', second: '' }] },
  ],
})

function addItem() {
  model.items.push({ name: '', list: [{ first: '', second: '' }] })
}

function removeItem(index: number) {
  model.items.splice(index, 1)
}

function addSubItem(index: number) {
  model.items[index].list.push({ first: '', second: '' })
}

function removeSubItem(itemIndex: number, subIndex: number) {
  model.items[itemIndex].list.splice(subIndex, 1)
}
</script>

<template>
  <sue-form
    name="dynamic_form_complex"
    :model="model"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 18 }"
    style="max-width: 600px"
  >
    <div style="display: flex; row-gap: 16px; flex-direction: column">
      <sue-card
        v-for="(item, index) in model.items"
        :key="`item-${index}`"
        size="small"
        :title="`Item ${index + 1}`"
        :extra="null"
      >
        <template #extra>
          <X @click="removeItem(index)" />
        </template>

        <sue-form-item :name="['items', index, 'name']" label="Name">
          <sue-input v-model:value="item.name" />
        </sue-form-item>

        <sue-form-item label="List">
          <div style="display: flex; flex-direction: column; row-gap: 16px">
            <sue-space
              v-for="(subItem, subIndex) in item.list"
              :key="`sub-${index}-${subIndex}`"
              align="baseline"
            >
              <sue-form-item no-style :name="['items', index, 'list', subIndex, 'first']">
                <sue-input v-model:value="subItem.first" placeholder="first" />
              </sue-form-item>
              <sue-form-item no-style :name="['items', index, 'list', subIndex, 'second']">
                <sue-input v-model:value="subItem.second" placeholder="second" />
              </sue-form-item>
              <X @click="removeSubItem(index, subIndex)" />
            </sue-space>
            <sue-button type="dashed" block @click="addSubItem(index)">
              + Add Sub Item
            </sue-button>
          </div>
        </sue-form-item>
      </sue-card>

      <sue-button type="dashed" block @click="addItem">
        + Add Item
      </sue-button>
    </div>

    <sue-form-item no-style>
      <div>
        <pre>{{ JSON.stringify(model, null, 2) }}</pre>
      </div>
    </sue-form-item>
  </sue-form>
</template>
```
