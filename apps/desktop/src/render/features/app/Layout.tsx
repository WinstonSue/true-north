import { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Flex, Spin, Splitter } from '@sue/design-web-react';
import cs from 'clsx';
import { useSelector } from 'react-redux';
import { RouterContext } from '@/router/useRouter';
import { GlobalState } from '@/store';
import { AppAside } from './AppAside';
import { useWorkbenchOptional, WorkbenchPanel } from '@/features/workbench';
import styles from './Layout.module.less';

export const ASIDE_WIDTH_KEY = 'app-aside-width';
export const DEFAULT_ASIDE_WIDTH = 280;
export const MIN_ASIDE_WIDTH = 240;
export const MAX_ASIDE_WIDTH = 420;
const MIN_CONVERSATION_WIDTH = 360;

function isAiPath(pathname: string) {
  return pathname === '/ai' || pathname.startsWith('/ai/');
}

function readAsideWidth() {
  if (typeof window === 'undefined') return DEFAULT_ASIDE_WIDTH;
  const parsed = Number(window.localStorage.getItem(ASIDE_WIDTH_KEY));
  if (!Number.isFinite(parsed)) return DEFAULT_ASIDE_WIDTH;
  return Math.min(MAX_ASIDE_WIDTH, Math.max(MIN_ASIDE_WIDTH, Math.round(parsed)));
}

function PageLayout() {
  useContext(RouterContext);
  const location = useLocation();
  const { userLoading } = useSelector((state: GlobalState) => state);
  const workbench = useWorkbenchOptional();
  const [asideWidth, setAsideWidth] = useState(readAsideWidth);

  const setLeftReserve = workbench?.setLeftReserve;

  useEffect(() => {
    setLeftReserve?.(asideWidth);
  }, [asideWidth, setLeftReserve]);

  return (
    <Flex container="full">
      {userLoading ? (
        <Spin className={styles.spin} />
      ) : (
        <>
          <Flex container="fill" className={styles.splitterWrap}>
            <Splitter
              className={styles.splitter}
              classNames={{
                dragger: {
                  default: styles.splitterDragger,
                  active: styles.splitterDraggerActive,
                },
              }}
              onResize={(sizes) => {
                const next = Math.round(sizes[0]);
                setAsideWidth(next);
                window.localStorage.setItem(ASIDE_WIDTH_KEY, String(next));
              }}
            >
              <Splitter.Panel
                size={asideWidth}
                min={MIN_ASIDE_WIDTH}
                max={MAX_ASIDE_WIDTH}
                className={styles.asidePanel}
              >
                <AppAside />
              </Splitter.Panel>
              <Splitter.Panel min={MIN_CONVERSATION_WIDTH} className={styles.contentPanel}>
                <Flex
                  container="fill"
                  vertical
                  className={cs(
                    styles['layout-content'],
                    isAiPath(location.pathname) && styles['layout-content-bleed'],
                  )}
                >
                  <Flex container="fill" className="overflow-y-auto">
                    <Outlet />
                  </Flex>
                </Flex>
              </Splitter.Panel>
            </Splitter>
          </Flex>
          <WorkbenchPanel />
        </>
      )}
    </Flex>
  );
}

export default PageLayout;
