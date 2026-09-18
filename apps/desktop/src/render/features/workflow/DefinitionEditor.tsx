import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Flex, message } from '@sue/design-web-react';
import { ProductSurface } from '@ylib/product-surface-react';
import { productRef } from '@ylib/product-server';
import { PageHeader } from '@true-north/plugin-ui';
import { WorkflowController } from '@true-north/web-service';
import { emptyWorkflowGraph, type WorkflowDefinitionGraph } from '@true-north/plugin-contract';
import { CanvasEditor } from './CanvasEditor';
import { WizardEditor } from './WizardEditor';
import { DefinitionDraftProvider, emptyDraft, type DefinitionDraft, type WorkflowCatalog } from './draft';
import useLocale from '@/utils/useLocale';
import styles from './style.module.less';

export function DefinitionEditor() {
  const location = useLocation();
  const id = location.pathname.replace(/^\/workflow\/definitions\//, '') || 'new';
  const navigate = useNavigate();
  const t = useLocale();
  const [mode, setMode] = useState<'canvas' | 'wizard'>('wizard');
  const [draft, setDraft] = useState<DefinitionDraft>(emptyDraft());
  const [catalog, setCatalog] = useState<WorkflowCatalog>({ events: [], commands: [], workspaces: [], templates: [] });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void WorkflowController.catalog().then((result) => setCatalog(result as unknown as WorkflowCatalog));
  }, []);

  useEffect(() => {
    if (!id || id === 'new') return;
    void WorkflowController.definition(id).then((item) => {
      setDraft({
        id: String(item.id),
        title: String(item.title || ''),
        description: item.description ? String(item.description) : undefined,
        graph: (item.graph as WorkflowDefinitionGraph) || emptyWorkflowGraph(),
        status: item.status ? String(item.status) : 'draft',
        currentVersion: typeof item.currentVersion === 'number' ? item.currentVersion : undefined,
      });
    });
  }, [id]);

  async function save() {
    setBusy(true);
    try {
      if (!draft.id) {
        const created = await WorkflowController.createDefinition({ title: draft.title, graph: draft.graph });
        message.success(t['workflow.editor.saved'] || '已保存草稿');
        navigate(`/workflow/definitions/${created.id}`);
        return;
      }
      await WorkflowController.updateDefinition(draft.id, { title: draft.title, graph: draft.graph });
      message.success(t['workflow.editor.saved'] || '已保存草稿');
    } catch (error) {
      message.error(error instanceof Error ? error.message : t['workflow.editor.saveFailed'] || '保存失败');
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (!draft.id) {
      await save();
      return;
    }
    setBusy(true);
    try {
      await WorkflowController.updateDefinition(draft.id, { title: draft.title, graph: draft.graph });
      await WorkflowController.publishDefinition(draft.id);
      message.success(t['workflow.editor.published'] || '已发布');
      navigate('/workflow');
    } catch (error) {
      message.error(error instanceof Error ? error.message : t['workflow.editor.publishFailed'] || '发布失败');
    } finally {
      setBusy(false);
    }
  }

  return (
    <DefinitionDraftProvider value={{ draft, setDraft, catalog }}>
      <ProductSurface id={productRef('workflow.editor.view.editor')}>
        <Flex vertical container="full" className={styles.editor}>
          <PageHeader
            title={t[draft.title] || draft.title || t['workflow.editor.new'] || '新建流程'}
            onBack={() => navigate('/workflow')}
            extra={
              <Flex gap={8} align="center">
                <Button type={mode === 'wizard' ? 'primary' : 'default'} onClick={() => setMode('wizard')}>
                  {t['workflow.editor.wizard'] || '向导'}
                </Button>
                <Button type={mode === 'canvas' ? 'primary' : 'default'} onClick={() => setMode('canvas')}>
                  {t['workflow.editor.canvas'] || '画布'}
                </Button>
                <Button loading={busy} onClick={() => void save()}>
                  {t['workflow.editor.save'] || '保存草稿'}
                </Button>
                <Button type="primary" loading={busy} onClick={() => void publish()}>
                  {t['workflow.editor.publish'] || '发布'}
                </Button>
              </Flex>
            }
          />
          <Flex
            vertical
            container="fill"
            className={mode === 'canvas' ? styles.canvasBody : styles.wizardBody}
          >
            {mode === 'canvas' ? <CanvasEditor /> : <WizardEditor />}
          </Flex>
        </Flex>
      </ProductSurface>
    </DefinitionDraftProvider>
  );
}
