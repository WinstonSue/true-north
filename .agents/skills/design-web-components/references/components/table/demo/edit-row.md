# Edit Row

## Description (en-US)

Table with editable rows.
> For all editable tables, do not use `v-model:value="record.xxx"` for two-way data binding, which may cause data anomalies.
> It is recommended to use forms to collect and validate data.

## Source

```vue
<script setup lang="ts">
import type { FormInstance, TableProps } from '@sue/design-web-vue'
import { ref } from 'vue'

interface DataType {
  key: string
  name: string
  age: number
  address: string
}

const originData = Array.from({ length: 100 }).map<DataType>((_, i) => ({
  key: i.toString(),
  name: `Edward ${i}`,
  age: 32,
  address: `London Park no. ${i}`,
}))

const dataSource = ref<DataType[]>(originData)
const formRef = ref<FormInstance | null>(null)
const formModel = ref<Record<string, any>>({ name: '', age: 0, address: '' })
const editingKey = ref('')

const editableColumns = new Set(['name', 'age', 'address'])
const columns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name', key: 'name', width: '25%' },
  { title: 'Age', dataIndex: 'age', key: 'age', width: '15%' },
  { title: 'Address', dataIndex: 'address', key: 'address', width: '40%' },
  { title: 'Operation', key: 'operation' },
]

const isEditing = (record: Record<string, any>) => record.key === editingKey.value

function edit(record: Record<string, any>) {
  formModel.value = { name: record.name, age: record.age, address: record.address }
  editingKey.value = record.key
}

async function save(key: string) {
  try {
    const values = await formRef.value?.validateFields()
    if (!values) {
      return
    }
    const newData = [...dataSource.value]
    const index = newData.findIndex(item => item.key === key)
    if (index > -1) {
      const item = newData[index]
      newData.splice(index, 1, { ...item, ...values } as DataType)
    }
    else {
      newData.push({ key, ...values } as DataType)
    }
    dataSource.value = newData
    editingKey.value = ''
  }
  catch (err) {
    console.log('Validate Failed:', err)
  }
}

function cancel() {
  editingKey.value = ''
}
</script>

<template>
  <sue-form ref="formRef" :model="formModel">
    <sue-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="{ onChange: cancel }"
      bordered
    >
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'operation'">
          <template v-if="isEditing(record)">
            <sue-space size="small">
              <a style="margin-inline-end: 8px" @click="save(record.key)">
                Save
              </a>
              <sue-popconfirm title="Sure to cancel?" @confirm="cancel">
                <a>Cancel</a>
              </sue-popconfirm>
            </sue-space>
          </template>
          <template v-else>
            <a
              :class="{ 'sue-editable-text-disabled': editingKey !== '' }"
              @click="editingKey === '' && edit(record)"
            >
              Edit
            </a>
          </template>
        </template>
        <template v-else-if="editableColumns.has(String(column.dataIndex))">
          <template v-if="isEditing(record)">
            <sue-form-item
              :name="column.dataIndex as string"
              :rules="[{ required: true, message: `Please Input ${column.title}!` }]"
              style="margin: 0"
            >
              <sue-input-number
                v-if="column.dataIndex === 'age'"
                v-model:value="formModel[column.dataIndex as string]"
              />
              <sue-input
                v-else
                v-model:value="formModel[column.dataIndex as string]"
              />
            </sue-form-item>
          </template>
          <template v-else>
            {{ text }}
          </template>
        </template>
      </template>
    </sue-table>
  </sue-form>
</template>
```
