import React, { forwardRef } from 'react';
import { useHover } from '@react-aria/interactions';
import PropTypes from 'prop-types';

import { useDeprecationWarning, useStatusClasses } from '../../hooks';
import { onHoverPropTypes } from '../../utils/docUtils/hoverProps';
import Box from '../Box/Box';

const ListItem = forwardRef(({
  children,
  className,
  isHovered,
  isSelected,
  onHoverChange,
  onHoverEnd,
  onHoverStart,
  ...others
}, ref) => {
  const { hoverProps } = useHover({
    onHoverChange,
    onHoverEnd,
    onHoverStart,
  });

  useDeprecationWarning('The ListItem will be depreciated in the near future, please use ListViewItem');
  const { classNames } = useStatusClasses(className, { isHovered, isSelected });

  return (
    <Box
      className={classNames}
      ref={ref}
      variant="listItem.container"
      isRow
      {...hoverProps}
      {...others}
    >
      {children}
    </Box>
  );
});

ListItem.propTypes = {
  /**
   * A list of class names to apply to the element
   */
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  /**
   * Sets the selected state of the ListItem
   */
  isSelected: PropTypes.bool,
  ...onHoverPropTypes,
};

ListItem.defaultProps = {
  isSelected: false,
};

ListItem.displayName = 'ListItem';

export default ListItem;
