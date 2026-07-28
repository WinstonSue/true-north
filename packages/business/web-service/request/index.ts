import { getElectronAPI, isElectronEnvironment } from './electron';
import { get, post, put, remove } from './server';

/**
 * 适配器装饰器
 */
export function request<T>({
  method,
}: {
  method: 'put' | 'post' | 'get' | 'remove';
}): (path: string, params?: Record<string, any>) => Promise<T> {
  if (isElectronEnvironment()) {
    const electronAPI = getElectronAPI();
    if (electronAPI) {
      // 重写
      return async function (path: string, params?: Record<string, any>): Promise<T> {
        console.log(
          `%c===========${method.toUpperCase()} ${path}===========`,
          'color: rgba(245, 63, 63, 0.7); font-size: 16px;'
        );
        console.log(`%cElectron API调用: `, 'color: rgb(22, 93, 255); font-size: 12px;');
        if (params) {
          console.log(
            Object.keys(params)
              .map((key) => `${key}: ${params[key]}`)
              .join('\n'),
            params
          );
        }
        try {
          const res = await electronAPI[method](path, params);
          console.log(`%cElectron API返回: `, 'color: rgb(0, 180, 42); font-size: 12px;');
          console.log(res.data);
          if (res.code !== 200) {
            throw new Error(res.message);
          }
          return res.data as Promise<T>;
        } catch (error) {
          console.error('%cElectron API调用失败:', 'color: rgb(245, 63, 63); font-size: 14px;');
          console.error(error);
          throw error;
        }
      };
    }
  }
  return {
    get,
    post,
    put,
    remove,
  }[method];
}
