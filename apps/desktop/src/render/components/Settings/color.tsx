import React from 'react';
import { Popover } from '@sue/design-web-react';

import { SketchPicker } from 'react-color';
import { generate } from '@ant-design/colors';
import { useSelector, useDispatch } from 'react-redux';
import { GlobalState } from '../../store';
import useLocale from '@/utils/useLocale';
import styles from './style/color-panel.module.less';

function hexToRgb(hex: string) {
  const normalized = hex.replace('#', '');
  const full =
  normalized.length === 3 ?
  normalized.
  split('').
  map((c) => c + c).
  join('') :
  normalized;
  const num = parseInt(full, 16);
  const r = num >> 16 & 255;
  const g = num >> 8 & 255;
  const b = num & 255;
  return `${r},${g},${b}`;
}

function ColorPanel() {
  const theme =
  document.querySelector('body')?.getAttribute('data-theme') || 'light';
  const settings = useSelector((state: GlobalState) => state.settings);
  const locale = useLocale();
  const themeColor = settings.themeColor;
  const list = generate(themeColor, { theme: theme === 'dark' ? 'dark' : 'default' });
  const dispatch = useDispatch();

  return (
    <div>
      <Popover
        trigger="hover"
        placement="bottomLeft"
        content={
        <SketchPicker
          color={themeColor}
          onChangeComplete={(color) => {
            const newColor = color.hex;
            dispatch({
              type: 'update-settings',
              payload: { settings: { ...settings, themeColor: newColor } }
            });
            const newList = generate(newColor, {
              theme: theme === 'dark' ? 'dark' : 'default'
            });
            newList.forEach((l, index) => {
              const channel = hexToRgb(l);
              document.body.style.setProperty(`--primary-${index + 1}`, channel);
              document.body.style.setProperty(`--link-${index + 1}`, channel);
              // Keep legacy alias in sync for residual Less/inline usage
              document.body.style.setProperty(`--arcoblue-${index + 1}`, channel);
            });
            if (newList[5]) {
              document.body.style.setProperty('--color-primary-6', newList[5]);
            }
          }} />

        }>

        <div className={styles.input}>
          <div
            className={styles.color}
            style={{ backgroundColor: themeColor }} />

          <span>{themeColor}</span>
        </div>
      </Popover>
      <ul className={styles.ul}>
        {list.map((item, index) =>
        <li
          key={index}
          className={styles.li}
          style={{ backgroundColor: item }} />

        )}
      </ul>
      <p style={{ fontSize: 12 }}>
        {locale['settings.color.tooltip']}
      </p>
    </div>);

}

export default ColorPanel;