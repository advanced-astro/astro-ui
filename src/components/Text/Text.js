import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { flexbox, layout, typography } from 'styled-system';
import { Text as ThemeUIText } from 'theme-ui';

import { textVariants } from '../../utils/devUtils/constants/variants';

const ExtendedText = styled(ThemeUIText)(layout, flexbox, typography);

const Text = React.forwardRef((props, ref) => (
  <ExtendedText variant="base" {...props} ref={ref} />
));

Text.propTypes = {
  variant: PropTypes.string,
};


Text.defaultProps = {
  variant: textVariants.BASE,
};

Text.displayName = 'Text';

export default Text;
