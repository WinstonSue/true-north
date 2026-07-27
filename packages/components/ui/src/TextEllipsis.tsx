import React from 'react';
import { Tooltip } from '@sue/design-web-react';

interface TextEllipsisProps {
  text?: string;
  lineStamp?: number;
  tooltip?: boolean;
  width?: string;
}

const TextEllipsis: React.FC<TextEllipsisProps> = ({
  text = '',
  lineStamp = 1,
  tooltip = false,
  width,
}) => {
  const style: React.CSSProperties = {
    overflow: 'hidden',
    width,
    ...(lineStamp <= 1
      ? {
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          flex: 1,
        }
      : {
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: lineStamp,
        }),
  };

  const content = (
    <span style={style} title={!tooltip ? text : undefined}>
      {text}
    </span>
  );

  if (tooltip && text) {
    return <Tooltip title={text}>{content}</Tooltip>;
  }

  return content;
};

export default TextEllipsis;
