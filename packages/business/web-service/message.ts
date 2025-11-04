export interface IMessage {
  error: (params: unknown) => void;
  success: (params: unknown) => void;
  warning: (params: unknown) => void;
  info: (params: unknown) => void;
}

export let Message: IMessage;

export const registerMessage = (_message: {
  error: (params: string) => void;
  success: (params: string) => void;
  warning: (params: string) => void;
  info: (params: string) => void;
}) => {
  Message.error = (params: unknown) => {
    if (params instanceof Error) {
      _message.error(params.message);
    } else if (typeof params === 'string') {
      _message.error(params);
    } else {
      _message.error('Unknown error type');
    }
  };
  Message.success = (params: unknown) => {
    if (typeof params === 'string') {
      _message.success(params);
    } else {
      _message.success('Unknown success type');
    }
  };
  Message.info = (params: unknown) => {
    if (typeof params === 'string') {
      _message.info(params);
    } else {
      _message.info('Unknown info type');
    }
  };
  Message.warning = (params: unknown) => {
    if (typeof params === 'string') {
      _message.warning(params);
    } else {
      _message.warning('Unknown warning type');
    }
  };
};
