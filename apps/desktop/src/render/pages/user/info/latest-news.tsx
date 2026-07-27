import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Skeleton, Avatar, Flex } from '@sue/design-web-react';

import styles from './style/index.module.less';

interface INews {
  title?: string;
  description?: string;
  avatar?: string;
}

function LatestNews() {
  const [data, setData] = useState<INews[]>(new Array(4).fill({}));
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    const { data } = await axios.
    get('/api/user/latestNews').
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
          padding: '24px 20px 24px 0px',
          borderTop:
          index > 0 ? '1px solid var(--color-border-2, #e5e6eb)' : undefined
        }}>

          {loading ?
        <Skeleton
          animation
          text={{ width: ['60%', '90%'], rows: 2 }}
          image={{ shape: 'circle' }} /> :

        <Flex
          gap={12}
          align="flex-start"
          className={styles['list-meta-ellipsis']}>

              <Avatar size={48}>
                <img src={item.avatar} />
              </Avatar>
              <Flex vertical gap={4} style={{ minWidth: 0, flex: 1 }}>
                <div>{item.title}</div>
                <div style={{ color: 'var(--color-text-3)' }}>
                  <p className="text-text-3 truncate"

              style={{ fontSize: '12px', margin: 0 }}>

                    {item.description}
                  </p>
                </div>
              </Flex>
            </Flex>
        }
        </div>
      )}
    </div>);

}

export default LatestNews;