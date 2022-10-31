import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { useTooltip } from 'react-aria';

import { TooltipContext } from '../../context/TooltipContext/index';
import Box from '../Box';
import Text from '../Text';

const Tooltip = forwardRef((props, ref) => {
  const {
    children,
    ...others
  } = props;
  const { state } = useContext(TooltipContext);
  const { tooltipProps } = useTooltip(props, state);
  const tooltipRef = useRef();

  /* istanbul ignore next */
  useImperativeHandle(ref, () => tooltipRef.current);

  return (
    <Box
      ref={tooltipRef}
      variant="tooltip.container"
      {...tooltipProps}
      {...others}
    >
      <Text variant="variants.tooltip.content">
        {children}
      </Text>
    </Box>
  );
});

export default Tooltip;
