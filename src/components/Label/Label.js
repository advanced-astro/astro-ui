import React, { forwardRef } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { flexbox, layout } from 'styled-system';
import { Label as ThemeUILabel } from 'theme-ui';

import { usePropWarning, useStatusClasses } from '../../hooks';
import Box from '../Box';
import HelpHint from '../HelpHint';

import { modes } from './constants';

const ExtendedLabel = styled(ThemeUILabel)(layout, flexbox);

const defaultIndicator = (
  <Box variant="forms.label.indicator">
    *
  </Box>
);

/**
 * Base label for an input.
 *
 * Accepts most of the styling props from [styled-system](https://styled-system.com/table).
 * Built on top of the [Label from Theme-UI](https://theme-ui.com/components/label).
 *
 * **NOTE**: Specialized field components contain built-in support for labels. It's
 * recommended to use those instead of a standalone `Label`.
 */

const Label = forwardRef((props, ref) => {
  const {
    children,
    className,
    isDisabled,
    isRequired,
    mode,
    requiredIndicator,
    hintText,
    helpHintProps,
    ...others
  } = props;

  usePropWarning(props, 'disabled', 'isDisabled');

  const { classNames } = useStatusClasses(className, {
    isDisabled,
    isRequired,
    isFloatLabel: mode === modes.FLOAT,
    isLeftLabel: mode === modes.LEFT,
  });

  return (
    <ExtendedLabel
      ref={ref}
      display="flex"
      className={classNames}
      {...others}
    >
      {children}
      {
        isRequired
        && (requiredIndicator || defaultIndicator)
      }
      {
        hintText
        && <HelpHint {...helpHintProps}>{hintText}</HelpHint>
      }
    </ExtendedLabel>
  );
});

Label.propTypes = {
  /** Whether the label has disabled styling applied. */
  isDisabled: PropTypes.bool,
  /** Whether the label has required indicator styling applied. */
  isRequired: PropTypes.bool,
  /** Determines the behavior pattern for the label. */
  mode: PropTypes.oneOf(Object.values(modes)),
  /** The visual component used to mark an input as required within the label. */
  requiredIndicator: PropTypes.node,
  /** If present this prop will cause a help hint to render in the label. */
  hintText: PropTypes.string,
  /** Props object that is spread directly into the helphint element. */
  helpHintProps: PropTypes.shape({}),
};

Label.defaultProps = {
  mode: modes.DEFAULT,
};

Label.displayName = 'Label';
export default Label;
