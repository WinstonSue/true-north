import React from 'react';
import { Alert, Card } from '@sue/design-web-react';

interface DesktopControllerTabProps {
  isActive?: boolean;
}

/**
 * Desktop Proxy Controller 同步已下线：
 * route-controller 直接注册 electron-ipc-restful，不再生成 *.controller.ts。
 */
const DesktopControllerTab: React.FC<DesktopControllerTabProps> = () => {
  return (
    <Card>
      <Alert
        type="info"
        title="Desktop Proxy Controller 已下线"
        content="*.route-controller.ts 同时承担 VO 边界与 IPC 路由注册，不再维护透传层 *.controller.ts。请使用「API 控制器差异」与「Web Service 差异」从 route-controller 同步客户端代码。"
      />
    </Card>
  );
};

export default DesktopControllerTab;
