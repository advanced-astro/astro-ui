import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef } from 'react';
import CircleSmallIcon from '@pingux/mdi-react/CircleSmallIcon';
import { useOption } from '@react-aria/listbox';
import PropTypes from 'prop-types';

import { useMultivaluesContext } from '../../context/MultivaluesContext';
import { useStatusClasses } from '../../hooks';
import { isIterableProp } from '../../utils/devUtils/props/isIterable';
import Box from '../Box';
import Icon from '../Icon';

import { ListBoxContext } from './ListBoxContext';

const Option = forwardRef((props, ref) => {
  const { item, hasVirtualFocus, ...others } = props;
  const { key, props: itemProps, rendered, 'aria-label': ariaLabel } = item;

  const state = useContext(ListBoxContext);
  const { isSeparator, 'data-id': dataId } = itemProps;
  // Get props for the option element
  const optionRef = useRef();
  /* istanbul ignore next */
  useImperativeHandle(ref, () => optionRef.current);
  const { optionProps, isDisabled, isSelected, isFocused } = useOption(
    {
      key,
      shouldSelectOnPressUp: true,
      shouldFocusOnHover: true,
      shouldUseVirtualFocus: hasVirtualFocus,
      isVirtualized: true,
      ...others,
    },
    state,
    optionRef,
  );

  const focused = isFocused || state?.selectionManager?.focusedKey === item.key;
  const setFocusOnHover = () => {
    if (!focused) {
      state.selectionManager.setFocusedKey(item.key);
    }
  };

  const { classNames } = useStatusClasses(null, {
    isDisabled: isDisabled || isSeparator,
    isFocused: focused,
    isSelected,
  });

  const updateActiveDescendant = useMultivaluesContext();

  useEffect(() => {
    if (isFocused && updateActiveDescendant) {
      updateActiveDescendant(optionProps.id);
    }
  }, [isFocused, updateActiveDescendant]);


  /* Related to UIP-4992
   * Need to remove these properties to avoid errors in the console on the external app.
   * By the way, these properties return "undefined", so it shouldn't create issues */
  delete optionProps.onPressStart;
  delete optionProps.onPressUp;

  return (
    <Box
      as="li"
      isRow
      ref={optionRef}
      variant="listBox.option"
      data-id={dataId}
      className={classNames}
      onPointerOver={setFocusOnHover}
      {...optionProps}
      {...others}
      aria-label={ariaLabel}
    >
      {isSelected && <Icon icon={CircleSmallIcon} title={{ name: 'Circle Small Icon' }} />}
      {rendered}
    </Box>
  );
});

Option.propTypes = {
  hasVirtualFocus: PropTypes.bool,
  item: PropTypes.shape({
    key: PropTypes.string,
    props: PropTypes.shape({
      'data-id': PropTypes.string,
      isSeparator: PropTypes.bool,
    }),
    rendered: PropTypes.node,
    'aria-label': PropTypes.string,
  }),
  state: PropTypes.shape({
    disabledKeys: isIterableProp,
    selectionManager: PropTypes.shape({
      focusedKey: PropTypes.string,
      isSelected: PropTypes.func,
    }),
  }),
};

Option.defaultProps = {
  item: {},
  state: {},
};

export default Option;
