import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { FocusScope, mergeProps, useOverlayPosition, useOverlayTrigger, useVisuallyHidden } from 'react-aria';
import { ChromePicker } from 'react-color';
import { useOverlayTriggerState } from 'react-stately';
import { useColorField } from '@react-aria/color';
import { useColorFieldState } from '@react-stately/color';
import PropTypes from 'prop-types';

import { Box, Button, FieldHelperText, Input, Label } from '../..';
import useField from '../../hooks/useField';
import { ariaAttributesBasePropTypes, getAriaAttributeProps } from '../../utils/docUtils/ariaAttributes';
import { inputFieldAttributesBasePropTypes } from '../../utils/docUtils/fieldAttributes';
import { statusPropTypes } from '../../utils/docUtils/statusProp';
import PopoverContainer from '../PopoverContainer';

const ColorField = forwardRef((props, ref) => {
  const {
    align,
    buttonProps,
    controlProps,
    direction,
    helperText,
    label,
    labelProps,
    onChange: imperativeOnChange,
    status,
  } = props;
  const { ariaProps, nonAriaProps } = getAriaAttributeProps(props);

  const colorRef = useRef();
  /* istanbul ignore next */
  useImperativeHandle(ref, () => colorRef.current);

  const triggerRef = React.useRef();
  const overlayRef = React.useRef();

  const state = useColorFieldState(nonAriaProps);
  const popoverState = useOverlayTriggerState({});

  const { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    popoverState,
    triggerRef,
  );

  const { labelProps: raLabelProps, inputProps: raInputProps } = useColorField(
    nonAriaProps,
    state,
    colorRef,
  );

  const { visuallyHiddenProps } = useVisuallyHidden();

  const {
    fieldContainerProps,
    fieldControlInputProps,
    fieldControlWrapperProps,
    fieldLabelProps,
  } = useField({
    ...nonAriaProps,
    labelProps: {
      ...labelProps,
      ...raLabelProps,
    },
    controlProps: {
      ...controlProps,
      ...raInputProps,
    },
  });

  const { overlayProps: positionProps } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef,
    placement: `${direction} ${align}`,
    offset: 15,
    isOpen: popoverState.isOpen,
    onClose: popoverState.close,
    shouldUpdatePosition: true,
  });

  /* istanbul ignore next */
  const handleButtonPress = useCallback(() => popoverState.open(), [
    triggerRef,
  ]);

  const handleColorChange = useCallback((color, event) => {
    if (imperativeOnChange) {
      imperativeOnChange(color, event);
    }
  }, [imperativeOnChange]);

  const getRgbaFromState = useCallback(({ colorValue }) => {
    return `rgba(${colorValue?.red}, ${colorValue?.green}, ${colorValue?.blue}, ${colorValue?.alpha})`;
  }, []);

  return (
    <Box {...fieldContainerProps}>
      {label && <Label {...fieldLabelProps} />}
      <Button
        aria-label="Select color"
        bg={getRgbaFromState(state)}
        onPress={handleButtonPress}
        ref={triggerRef}
        variant="forms.colorField.container"
        {...mergeProps(buttonProps, ariaProps, triggerProps)}
      />
      <Box {...fieldControlWrapperProps}>
        <Input {...visuallyHiddenProps} {...fieldControlInputProps} ref={colorRef} />
      </Box>
      {helperText && (
        <FieldHelperText status={status}>{helperText}</FieldHelperText>
      )}
      <PopoverContainer
        hasNoArrow
        isDismissable
        isNonModal
        isNotClosedOnBlur
        isOpen={popoverState.isOpen}
        onClose={popoverState.close}
        ref={overlayRef}
        {...overlayProps}
        {...positionProps}
      >
        <FocusScope restoreFocus contain autoFocus>
          <ChromePicker
            color={getRgbaFromState(state)}
            onChange={handleColorChange}
          />
        </FocusScope>
      </PopoverContainer>
    </Box>
  );
});

ColorField.propTypes = {
  /** Alignment of the popover menu relative to the trigger. */
  align: PropTypes.oneOf(['start', 'end', 'middle']),
  /** Where the popover menu opens relative to its trigger. */
  direction: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  /** Text to display after the Color Field button. Useful for errors or other info. */
  helperText: PropTypes.node,
  /** The content to display as the label. */
  label: PropTypes.node,
  /** Pass a function to call every time the color is changed. [React Color onChange](https://casesandberg.github.io/react-color/#api-onChange)
   *
   * (color, event) => void;
   */
  onChange: PropTypes.func,
  /** Color controls what color is active on the color picker. */
  value: PropTypes.string,
  /** Props object that is spread into the Button element. */
  buttonProps: PropTypes.shape({}),
  ...statusPropTypes,
  ...ariaAttributesBasePropTypes,
  ...inputFieldAttributesBasePropTypes,
};

ColorField.defaultProps = {
  align: 'middle',
  direction: 'bottom',
};

ColorField.displayName = 'ColorField';

export default ColorField;
