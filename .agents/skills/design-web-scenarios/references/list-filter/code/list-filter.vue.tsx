import { computed, defineComponent, ref } from "vue";
import { Alert, Button, Empty, Flex, Form, FormItem, Input, Pagination, Table } from "@sue/design-web-vue";

type Row = { id: string; name: string; status: string };

export const ListFilter = defineComponent({
  name: "ListFilter",
  setup() {
    const loading = ref(false);
    const error = ref<string | null>(null);
    const rows = ref<Row[]>([]);
    const total = ref(0);
    const current = ref(1);
    const filters = ref({ keyword: "" });
    const showEmpty = computed(() => !loading.value && !error.value && rows.value.length === 0);

    async function load() {
      loading.value = true;
      error.value = null;
      try {
        rows.value = [];
        total.value = 0;
      } catch (cause) {
        error.value = cause instanceof Error ? cause.message : "加载失败";
      } finally {
        loading.value = false;
      }
    }

    return () => (
      <Flex vertical container="full">
        <Flex container="fixed">
          <Form layout="inline">
            <FormItem>
              <Input
                value={filters.value.keyword}
                placeholder="搜索"
                onUpdate:value={(value: string) => {
                  filters.value.keyword = value;
                }}
              />
            </FormItem>
            <FormItem>
              <Button type="primary" onClick={() => { current.value = 1; void load(); }}>
                查询
              </Button>
            </FormItem>
          </Form>
        </Flex>
        <Flex vertical container="fill">
          {error.value ? (
            <Alert type="error" showIcon message={error.value} action={<Button onClick={() => void load()}>重试</Button>} />
          ) : showEmpty.value ? (
            <Empty description="暂无数据" />
          ) : (
            <Table full rowKey="id" loading={loading.value} dataSource={rows.value} pagination={false} />
          )}
          <Flex container="fixed">
            <Pagination current={current.value} total={total.value} onChange={(page: number) => { current.value = page; void load(); }} />
          </Flex>
        </Flex>
      </Flex>
    );
  },
});
