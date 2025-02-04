import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { mergeProps, useFocusRing } from 'react-aria';
import { useHover, usePress } from '@react-aria/interactions';
import PropTypes from 'prop-types';

import { useNavBarContext } from '../../context/NavBarContext';
import { useNavBarPress, useStatusClasses } from '../../hooks';
import { Box, Icon, Text } from '../../index';

const NavBarItem = forwardRef((props, ref) => {
  const {
    icon,
    text,
    className,
    id: key,
    onPress: onPressCallback,
    ...others
  } = props;

  const navItemRef = useRef();

  /* istanbul ignore next */
  useImperativeHandle(ref, () => navItemRef.current);

  const { hoverProps, isHovered } = useHover({});

  const {
    focusProps: focusWithinProps,
  } = useFocusRing({ within: true });

  const { focusProps, isFocusVisible } = useFocusRing();

  const state = useNavBarContext();

  const isSelected = state.selectedKey === key;

  const { onNavPress } = useNavBarPress({ key, onPressCallback }, state);

  const { pressProps, isPressed } = usePress({ ref: navItemRef, onPress: onNavPress });

  const mergedProps = mergeProps(
    pressProps,
    hoverProps,
    focusWithinProps,
    focusProps,
    others,
  );

  const { classNames } = useStatusClasses(className, {
    isPressed,
    isHovered,
    isSelected,
    isFocused: isFocusVisible,
  });
  const color = isSelected ? 'white' : 'neutral.95';

  return (
    <Box
      id={key}
      variant={state.navStyles.navBarItem}
      isRow
      tabIndex={0}
      className={classNames}
      ref={navItemRef}
      {...mergedProps}
      sx={{
        flexGrow: 0,
      }}
    >
      <Box
        isRow
        sx={{
          alignItems: 'center',
        }}
      >
        {icon
          && (
            <Icon
              icon={icon}
              title={{ name: text }}
              size="sm"
              sx={{
                mr: 'sm',
                color,
                fill: color,
              }}
            />
          )}
        <Text variant={state.navStyles.navBarItemText}>
          {text}
        </Text>
      </Box>
    </Box>
  );
});

NavBarItem.propTypes = {
  /**  Handler that is called when the press is released over the target. */
  onPress: PropTypes.func,
  /** The icon to render in between each node. */
  icon: PropTypes.elementType,
  /** The element's unique identifier. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id). */
  id: PropTypes.string,
  /** Text that will render within the component */
  text: PropTypes.string,
};

export default NavBarItem;
