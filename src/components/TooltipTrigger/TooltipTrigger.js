import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useOverlayPosition, useTooltipTrigger } from 'react-aria';
import { useTooltipTriggerState } from 'react-stately';
import { PressResponder } from '@react-aria/interactions';
import PropTypes from 'prop-types';

import { TooltipContext } from '../../context/TooltipContext/index';
import { usePropWarning, useStatusClasses } from '../../hooks';
import PopoverContainer from '../PopoverContainer';

const TooltipTrigger = forwardRef((props, ref) => {
  const {
    arrowCrossOffset,
    children,
    crossOffset,
    isDisabled,
    align,
    direction,
    offset,
    trigger: triggerAction,
    className,
    isNotFlippable,
    isDarkMode,
    hasNoArrow,
    targetRef,
    width,
  } = props;

  const [trigger, tooltip] = React.Children.toArray(children);

  const state = useTooltipTriggerState(props);

  const tooltipTriggerRef = useRef();
  const overlayRef = useRef();

  const tooltipRef = targetRef || tooltipTriggerRef;

  usePropWarning(props, 'disabled', 'isDisabled');
  /* istanbul ignore next */
  useImperativeHandle(ref, () => tooltipRef.current);

  const { triggerProps, tooltipProps } = useTooltipTrigger({
    isDisabled,
    trigger: triggerAction,
  }, state, tooltipRef);

  const { overlayProps: positionProps, arrowProps, placement } = useOverlayPosition({
    placement: `${direction} ${align}`,
    targetRef: tooltipRef,
    overlayRef,
    offset,
    // Our API preference is for default false so we invert this since it should be default true
    shouldFlip: !isNotFlippable,
    crossOffset,
    isOpen: state.isOpen,
  });

  const { classNames } = useStatusClasses(className, {
    [`is-${direction}`]: direction,
    isDarkMode,
  });

  const overlay = (
    <PopoverContainer
      isOpen={state.isOpen}
      ref={overlayRef}
      placement={placement}
      arrowProps={arrowProps}
      className={classNames}
      hasNoArrow={hasNoArrow}
      arrowCrossOffset={arrowCrossOffset}
      width={width}
      direction={direction}
      isNonModal
      {...positionProps}
      {...tooltipProps}
    >
      {tooltip}
    </PopoverContainer>
  );

  return (
    <>
      <PressResponder {...triggerProps} ref={tooltipTriggerRef}>
        {trigger}
      </PressResponder>
      <TooltipContext.Provider value={{ state }}>
        {overlay}
      </TooltipContext.Provider>
    </>
  );
});

TooltipTrigger.propTypes = {
  /** Alignment of the popover menu relative to the trigger. */
  align: PropTypes.oneOf(['start', 'end', 'middle']),
  /** The additional offset applied along the cross axis
   * between the element and its anchor element. */
  crossOffset: PropTypes.number,
  /** Amount of time before the tooltip shows */
  delay: PropTypes.number,
  /** Where the popover menu opens relative to its trigger. */
  direction: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  /** Whether or not the tooltip is disabled. */
  isDisabled: PropTypes.bool,
  /** Defaults to true, displays dark tooltip with white text */
  isDarkMode: PropTypes.bool,
  /** Whether the overlay is open by default (controlled). */
  isOpen: PropTypes.bool,
  /** Whether the overlay is open by default (uncontrolled). */
  isDefaultOpen: PropTypes.bool,
  /**
     * Whether the popover is prevented from flipping directions when insufficient space is
     * available for the given `direction` placement.
     */
  isNotFlippable: PropTypes.bool,
  /**
   * Allows to add an arrow to popover container
   */
  hasNoArrow: PropTypes.bool,
  /** Tooltip offset relative to its trigger. */
  offset: PropTypes.number,
  /** Arrow offset relative to the left of the tooltip.
   * Must be passed as a px or percentage. */
  arrowCrossOffset: PropTypes.string,
  /** The placement of the element with respect to its anchor element. */
  placement: PropTypes.string,
  /** By default, opens for both focus and hover. Can be made to open only for focus. */
  trigger: PropTypes.string,
  /** Width applied to the wrapper of the tooltip component. */
  width: PropTypes.string,
  /* The ref for the element which the overlay positions itself with respect to. */
  targetRef: PropTypes.shape({}),
};

TooltipTrigger.defaultProps = {
  align: 'middle',
  crossOffset: 0,
  delay: 0,
  direction: 'bottom',
  isNotFlippable: false,
  isDarkMode: true,
  hasNoArrow: false,
  offset: 10,
};

export default TooltipTrigger;
