import React, { forwardRef, useRef, useState, useLayoutEffect } from 'react';
import CloseIcon from 'mdi-react/CloseIcon';
import PropTypes from 'prop-types';

import { NoticeIcon } from '../Icon/NoticeIcon';
import statuses from '../../utils/devUtils/constants/statuses';
import useStatusClasses from '../../hooks/useStatusClasses';
import { Box, Icon, IconButton, Text } from '../..';

export const ARIA_STATUSES = {
  SUCCESS: 'Success Message',
  ERROR: 'Error Message',
  WARNING: 'Warning Message',
};

const CloseButton = ({ color, ...others }) => {
  return (
    <IconButton aria-label="Close" {...others}>
      <Icon color={color} icon={CloseIcon} sx={{ path: { fill: color } }} />
    </IconButton>
  );
};

CloseButton.propTypes = {
  color: PropTypes.string,
};

const Message = forwardRef(({ className, item, onClose }, ref) => {
  const { key, props: itemProps } = item;

  const {
    children,
    status = 'default',
    bg,
    color,
    icon,
    isHidden = false,
    'data-id': dataId,
  } = itemProps;

  const { classNames: statusClasses } = useStatusClasses(className, {
    [`is-${status}`]: true,
  });

  const onCloseHandler = () => {
    if (onClose) {
      onClose(key);
    }
  };

  const innerRef = useRef(null);
  const [innerHeight, setInnerHeight] = useState(0);

  useLayoutEffect(() => {
    setInnerHeight(innerRef.current.clientHeight);
  }, [children]);

  const { classNames: wrapperClasses } = useStatusClasses(className, {
    isHidden,
  });

  const ariaStatus = (ariaStatusClass) => {
    if (ariaStatusClass === 'is-success') {
      return ARIA_STATUSES.SUCCESS;
    } else if (ariaStatusClass === 'is-error') {
      return ARIA_STATUSES.ERROR;
    } else if (ariaStatusClass === 'is-warning') {
      return ARIA_STATUSES.WARNING;
    } return '';
  };

  const messageIconProps = {
    className: statusClasses,
    color,
    mr: 'md',
  };

  const messageIcon = icon ?
    (<Icon
      icon={icon}
      data-testid="custom-icon-testid"
      {...messageIconProps}
    />) :
    (<NoticeIcon
      status={status}
      {...messageIconProps}
    />);

  return (
    <Box
      variant="messages.transition"
      className={wrapperClasses}
      sx={{
        maxHeight: !isHidden ? innerHeight : 0,
      }}
      data-id={dataId}
      role="status"
      aria-live="polite"
      aria-label={ariaStatus(statusClasses)}
    >
      <Box ref={innerRef}>
        <Box
          ref={ref}
          isRow
          variant="messages.item"
          className={statusClasses}
          bg={bg}
        >
          {messageIcon}
          <Text
            className={statusClasses}
            color={color}
            mr="md"
          >
            {children}
          </Text>
          <CloseButton
            onPress={onCloseHandler}
            variant="close"
            className={statusClasses}
            color={color}
          />
        </Box>
      </Box>
    </Box>
  );
});

Message.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string,
    props: PropTypes.shape({
      children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
      /* status changes the background, text, and button color accordingly */
      status: PropTypes.oneOf(Object.values(statuses)),
      /* Background color */
      bg: PropTypes.string,
      /* Text color */
      color: PropTypes.string,
      /* Message icon */
      icon: PropTypes.elementType,
      /* Hides the message with an animated transition */
      isHidden: PropTypes.bool,
      'data-id': PropTypes.string,
    }),
  }),
  /* Callback for clicking the message's close button */
  onClose: PropTypes.func,
};

export default Message;
