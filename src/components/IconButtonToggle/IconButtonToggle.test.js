import React from 'react';
import EyeOffIcon from '@pingux/mdi-react/EyeOffOutlineIcon';
import EyeIcon from '@pingux/mdi-react/EyeOutlineIcon';

import axeTest from '../../utils/testUtils/testAxe';
import { render, screen } from '../../utils/testUtils/testWrapper';

import IconButtonToggle from '.';

const iconTestId = 'test-icon';

const OnIcon = props => (
  <EyeIcon data-testid={iconTestId} {...props} title={{ name: 'on-icon' }} />
);

const OffIcon = props => (
  <EyeOffIcon data-testid={iconTestId} {...props} title={{ name: 'off-icon' }} />
);

const testId = 'test-button';
const defaultProps = {
  buttonProps: {
    'data-testid': testId,
    'aria-label': 'Eye',
  },
  defaultIcon: OffIcon,
  toggledIcon: OnIcon,
};
const getComponent = (props = {}) => render(<IconButtonToggle {...defaultProps} {...props} />);

// Need to be added to each test file to test accessibility using axe.
axeTest(getComponent);

test('default icon button', () => {
  getComponent();
  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('data-testid', testId);
  expect(button).toBeInstanceOf(HTMLButtonElement);
  expect(button).toBeInTheDocument();
});
