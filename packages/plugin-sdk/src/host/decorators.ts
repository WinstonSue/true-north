import {
  Controller as IpcController,
  Get as IpcGet,
  Post as IpcPost,
  Put as IpcPut,
  Delete as IpcDelete,
  Body as IpcBody,
  Param as IpcParam,
  Query as IpcQuery,
} from 'electron-ipc-restful';

type MethodOptions = { description?: string };

function methodDecorator(ipcDecorator: (path?: string) => MethodDecorator) {
  return (path?: string, _options?: MethodOptions) => ipcDecorator(path ?? '');
}

export const Get = methodDecorator(IpcGet);
export const Post = methodDecorator(IpcPost);
export const Put = methodDecorator(IpcPut);
export const Delete = methodDecorator(IpcDelete);

export function Controller(path?: string) {
  return function <T extends { new (...args: unknown[]): object }>(constructor: T) {
    IpcController(path)(constructor);
    return constructor;
  };
}

export function Body(name?: string) {
  return function (target: object, propertyKey: string | symbol | undefined, parameterIndex: number) {
    IpcBody(name)(target, propertyKey, parameterIndex);
  };
}

export function Param(name?: string) {
  return function (target: object, propertyKey: string | symbol | undefined, parameterIndex: number) {
    IpcParam(name)(target, propertyKey, parameterIndex);
  };
}

export function Query(name?: string) {
  return function (target: object, propertyKey: string | symbol | undefined, parameterIndex: number) {
    IpcQuery(name)(target, propertyKey, parameterIndex);
  };
}
