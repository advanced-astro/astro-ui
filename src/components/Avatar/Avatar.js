import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Avatar as ThemeUIAvatar } from 'theme-ui';

const Avatar = forwardRef((props, ref) => {
  return (
    <ThemeUIAvatar
      ref={ref}
      {...props}
    />
  );
});

Avatar.propTypes = {
  /**  Source of avatar. */
  src: PropTypes.string.isRequired,
  /** Alternative text for avatar. */
  alt: PropTypes.string,
};

Avatar.defaultProps = {
  alt: 'Avatar',
};

Avatar.displayName = 'Avatar';
export default Avatar;
