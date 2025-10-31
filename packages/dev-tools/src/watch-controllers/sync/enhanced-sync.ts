import { 
  detectMethodContentChanges, 
  syncMethodContentChanges, 
  MethodChange, 
  MethodChangeType 
} from './method-content-sync';
import { getServerMethodDecorators } from '../parser';
import { syncMissingMethods } from './sync-database';

/**
 * 增强的同步结果
 */
export interface EnhancedSyncResult {
  hasChanges: boolean;
  methodChanges: MethodChange[];
  newContent: string;
  summary: {
    totalMethods: number;
    changedMethods: number;
    addedMethods: number;
    signatureChanges: number;
    parameterChanges: number;
    decoratorChanges: number;
    bodyChanges: number;
  };
}

/**
 * 增强的控制器同步 - 支持方法内容级别的比对和同步
 */
export function enhancedSyncController(
  targetContent: string,
  sourceContent: string,
  className: string
): EnhancedSyncResult {
  // 1. 获取来源代码方法列表
  const sourceMethodDecorators = getServerMethodDecorators(sourceContent, className);
  const sourceMethods = Array.from(sourceMethodDecorators.keys());
  
  // 2. 先执行传统的方法级同步（添加缺失的方法）
  let syncedContent = syncMissingMethods(targetContent, className, sourceContent);
  
  // 3. 检测方法内容级别的变更
  const methodChanges = detectMethodContentChanges(
    sourceContent,
    syncedContent,
    className,
    sourceMethods
  );
  
  // 4. 同步方法内容变更
  const finalContent = syncMethodContentChanges(syncedContent, className, methodChanges);
  
  // 5. 生成同步摘要
  const summary = generateSyncSummary(methodChanges, sourceMethods.length);
  
  return {
    hasChanges: methodChanges.length > 0 || syncedContent !== targetContent,
    methodChanges,
    newContent: finalContent,
    summary
  };
}

/**
 * 生成同步摘要
 */
function generateSyncSummary(changes: MethodChange[], totalMethods: number) {
  const summary = {
    totalMethods,
    changedMethods: 0,
    addedMethods: 0,
    signatureChanges: 0,
    parameterChanges: 0,
    decoratorChanges: 0,
    bodyChanges: 0
  };
  
  for (const change of changes) {
    if (change.changeType !== MethodChangeType.NO_CHANGE) {
      summary.changedMethods++;
      
      switch (change.changeType) {
        case MethodChangeType.SIGNATURE_CHANGED:
          summary.signatureChanges++;
          break;
        case MethodChangeType.PARAMETERS_CHANGED:
          summary.parameterChanges++;
          break;
        case MethodChangeType.DECORATORS_CHANGED:
          summary.decoratorChanges++;
          break;
        case MethodChangeType.BODY_CHANGED:
          summary.bodyChanges++;
          break;
      }
      
      if (!change.targetMethod) {
        summary.addedMethods++;
      }
    }
  }
  
  return summary;
}

/**
 * 检查控制器是否需要同步
 */
export function checkControllerNeedsSync(
  targetContent: string,
  sourceContent: string,
  className: string
): boolean {
  const sourceMethodDecorators = getServerMethodDecorators(sourceContent, className);
  const sourceMethods = Array.from(sourceMethodDecorators.keys());
  
  const methodChanges = detectMethodContentChanges(
    sourceContent,
    targetContent,
    className,
    sourceMethods
  );
  
  return methodChanges.some(change => change.changeType !== MethodChangeType.NO_CHANGE);
}

/**
 * 获取详细的变更报告
 */
export function getDetailedChangeReport(changes: MethodChange[]): string {
  if (changes.length === 0) {
    return 'No changes detected.';
  }
  
  const report: string[] = [];
  report.push(`Found ${changes.length} method changes:`);
  
  for (const change of changes) {
    const changeIcon = getChangeIcon(change.changeType);
    report.push(`  ${changeIcon} ${change.methodName}: ${change.details}`);
    
    if (change.changeType === MethodChangeType.PARAMETERS_CHANGED) {
      const sourceParams = change.sourceMethod.parameters.map(p => 
        p.decorator ? `@${p.decorator} ${p.name}: ${p.type}` : `${p.name}: ${p.type}`
      ).join(', ');
      
      const targetParams = change.targetMethod?.parameters.map(p => 
        p.decorator ? `@${p.decorator} ${p.name}: ${p.type}` : `${p.name}: ${p.type}`
      ).join(', ') || 'N/A';
      
      report.push(`    Server:  (${sourceParams})`);
      report.push(`    Desktop: (${targetParams})`);
    }
    
    if (change.changeType === MethodChangeType.DECORATORS_CHANGED) {
      const serverDecorators = change.sourceMethod.decorators.map(d => `@${d.name}(${d.args})`).join(' ');
      const targetDecorators = change.targetMethod?.decorators.map(d => `@${d.name}(${d.args})`).join(' ') || 'N/A';
      
      report.push(`    Server:  ${serverDecorators}`);
      report.push(`    Desktop: ${targetDecorators}`);
    }
  }
  
  return report.join('\n');
}

/**
 * 获取变更类型图标
 */
function getChangeIcon(changeType: MethodChangeType): string {
  switch (changeType) {
    case MethodChangeType.SIGNATURE_CHANGED:
      return '📝';
    case MethodChangeType.PARAMETERS_CHANGED:
      return '🔧';
    case MethodChangeType.DECORATORS_CHANGED:
      return '🏷️';
    case MethodChangeType.BODY_CHANGED:
      return '📦';
    default:
      return '❓';
  }
}

/**
 * 批量检查多个控制器的同步状态
 */
export interface ControllerSyncStatus {
  className: string;
  filePath: string;
  needsSync: boolean;
  changes: MethodChange[];
  summary: ReturnType<typeof generateSyncSummary>;
}

export function batchCheckControllerSync(
  controllers: Array<{
    className: string;
    targetPath: string;
    sourcePath: string;
    targetContent: string;
    sourceContent: string;
  }>
): ControllerSyncStatus[] {
  return controllers.map(controller => {
    const changes = detectMethodContentChanges(
      controller.sourceContent,
      controller.targetContent,
      controller.className,
      Array.from(getServerMethodDecorators(controller.sourceContent, controller.className).keys())
    );
    
    const needsSync = changes.some(change => change.changeType !== MethodChangeType.NO_CHANGE);
    const summary = generateSyncSummary(changes, changes.length);
    
    return {
      className: controller.className,
      filePath: controller.targetPath,
      needsSync,
      changes,
      summary
    };
  });
}
