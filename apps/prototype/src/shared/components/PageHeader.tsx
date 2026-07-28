import type React from 'react';
import { Flex } from '@sue/design-web-react';
import styles from './PageHeader.module.css';

export function PageHeader({ title, detail, action, wikiId }: { title: string; detail: string; action?: React.ReactNode; wikiId?: string }) {
  return <Flex justify="space-between" align="start" className={styles.pageHeader} data-product-wiki={wikiId}><div><h1>{title}</h1><p>{detail}</p></div>{action}</Flex>;
}
