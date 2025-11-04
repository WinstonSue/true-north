import React from 'react'
import { Modal, Button } from '@arco-design/web-react'
import { IconSync } from '@arco-design/web-react/icon'

interface MethodDetailsModalProps {
  visible: boolean
  onClose: () => void
  controller: any
  onSync: (className: string) => void
}

const MethodDetailsModal: React.FC<MethodDetailsModalProps> = ({ 
  visible, 
  onClose, 
  controller, 
  onSync 
}) => {
  if (!controller) return null

  return (
    <Modal
      title={`${controller.className} 控制器详情`}
      visible={visible}
      onCancel={onClose}
      style={{ width: 800 }}
      footer={
        <div>
          <Button onClick={onClose}>
            关闭
          </Button>
          {controller.needsSync && (
            <Button 
              type="primary" 
              icon={<IconSync />}
              onClick={() => {
                onSync(controller.className)
                onClose()
              }}
            >
              同步控制器
            </Button>
          )}
        </div>
      }
    >
      <div style={{ padding: '16px 0' }}>
        <div style={{ marginBottom: '16px' }}>
          <p><strong>类名:</strong> {controller.className}</p>
          <p><strong>文件路径:</strong> {controller.filePath}</p>
          <p><strong>需要同步:</strong> {controller.needsSync ? '是' : '否'}</p>
          <p><strong>变更数量:</strong> {controller.changes?.length || 0}</p>
        </div>
        
        {controller.changes && controller.changes.length > 0 && (
          <div>
            <h4>变更详情:</h4>
            <ul>
              {controller.changes.map((change: any, index: number) => (
                <li key={index} style={{ marginBottom: '8px' }}>
                  <strong>{change.methodName}:</strong> {change.details}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {(!controller.changes || controller.changes.length === 0) && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p>该控制器与服务端版本一致，无需同步</p>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default MethodDetailsModal
