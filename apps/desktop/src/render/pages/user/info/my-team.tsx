import React, { useState, useEffect } from 'react';
import { Avatar, Skeleton, Flex } from '@sue/design-web-react';

import axios from 'axios';

interface ITeam {
  avatar?: string;
  name?: string;
  members?: number;
}

function MyTeam() {
  const [data, setData] = useState<ITeam[]>(new Array(4).fill({}));
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    const { data } = await axios.
    get('/api/users/teamList').
    finally(() => setLoading(false));
    setData(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      {data.map((item, index) =>
      <div
        key={index}
        style={{
          padding:
          index !== data.length - 1 ? '8px 0px' : '8px 0px 0px 0px',
          borderTop:
          index > 0 ? '1px solid var(--color-border-2, #e5e6eb)' : undefined
        }}>

          {loading ?
        <Skeleton
          animation
          text={{ width: ['80%', '20%'], rows: 2 }}
          image={{ shape: 'circle' }} /> :

        <Flex gap={12} align="flex-start">
              <Avatar size={48}>
                <img src={item.avatar} />
              </Avatar>
              <Flex vertical gap={4} style={{ minWidth: 0, flex: 1 }}>
                <div>{item.name}</div>
                <div style={{ color: 'var(--color-text-3)' }}>
                  <span className="text-text-3" style={{ fontSize: '12px' }}>{`共${(
                item.members || 0).
                toLocaleString()}人`}</span>
                </div>
              </Flex>
            </Flex>
        }
        </div>
      )}
    </div>);

}

export default MyTeam;