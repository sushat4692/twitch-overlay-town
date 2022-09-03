import React, { useMemo } from "react";
import { Card } from 'antd';

import { useCurrentValue } from "../../state/Current";
import { useWindowValue } from "../../state/Window";
import { BlockSize } from "../../const/Town";
import { WindowGap } from '../../const/Window'

export const Popover: React.FC = () => {
  const current = useCurrentValue();
  const { x, y, scale } = useWindowValue();

  const parentStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (!current) {
      return undefined;
    }

    return {
      position: 'absolute',
      transition: '0.3s left, 0.3s top, 0.3s width, 0.3s height',
      left: current.building_x * BlockSize * scale + WindowGap + x,
      top: current.building_y * BlockSize * scale + WindowGap + y,
      width: (current.building_width * BlockSize * scale),
      height: (current.building_height * BlockSize * scale),
      pointerEvents: 'none'
    }
  }, [current, x, y, scale])

  const cardStyle = useMemo<React.CSSProperties | undefined>(() => {
    if (!current) {
      return undefined;
    }

    return {
      position: 'absolute',
      transition: '0.3s left, 0.3s bottom',
      left: 0,
      bottom: (current.building_height * BlockSize * scale) + 10,
      pointerEvents: 'none'
    }
  }, [current, x, y, scale]);

  return current ? (
      <div style={parentStyle}>
        <Card size="small" title={current.user_display_name} style={cardStyle}>
          <p style={{margin: 0}}>Rank : {current.building_rank}</p>
        </Card>
      </div>
  ) : null;
}