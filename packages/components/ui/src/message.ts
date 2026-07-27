export type MessageApi = {
  error: (content: string) => void;
  success: (content: string) => void;
  warning: (content: string) => void;
  info: (content: string) => void;
};

let messageImpl: MessageApi | null = null;

const consoleFallback: MessageApi = {
  error: (content) => console.error('[message]', content),
  success: (content) => console.log('[message:success]', content),
  warning: (content) => console.warn('[message]', content),
  info: (content) => console.info('[message]', content),
};

export function setMessageImpl(impl: MessageApi) {
  messageImpl = impl;
}

export function getMessage(): MessageApi {
  return messageImpl ?? consoleFallback;
}

export const message: MessageApi = {
  error: (content) => getMessage().error(content),
  success: (content) => getMessage().success(content),
  warning: (content) => getMessage().warning(content),
  info: (content) => getMessage().info(content),
};
