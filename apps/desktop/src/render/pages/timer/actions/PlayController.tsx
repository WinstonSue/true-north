import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons';
import React from 'react';

interface PlayControllerProps {
  state: boolean;
  setState: (state: boolean) => void;
  className?: string;
}

const PlayController: React.FC<PlayControllerProps> = ({
  state,
  setState,
  className,
}) => {
  const handleClick = () => {
    setState(!state);
  };

  return (
    <>
      {!state ? (
        <PlayCircleOutlined
          className={className}
          onClick={handleClick}
          style={{ color: '#fff', fontSize: '30px' }}
        />
      ) : (
        <PauseCircleOutlined
          className={className}
          onClick={handleClick}
          style={{ color: '#fff', fontSize: '30px' }}
        />
      )}
    </>
  );
};

export default PlayController;
