import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '.';
import axeTest from '../../utils/testUtils/testAxe';

const testId = 'test-input';
const defaultProps = {
  'data-testid': testId,
};
const getComponent = (props = {}) => render(<Input {...defaultProps} {...props} />);

// Need to be added to each test file to test accessibility using axe.
axeTest(getComponent);

test('default input', () => {
  getComponent();
  const input = screen.getByTestId(testId);
  expect(input).toBeInstanceOf(HTMLInputElement);
  expect(input).toBeInTheDocument();
});

test('input type as password', () => {
  getComponent({ type: 'password' });
  const input = screen.getByTestId(testId);
  expect(input).toHaveAttribute('type', 'password');
});

test('maxlength field with a set maxlength', () => {
  getComponent({ maxLength: 3 });
  const input = screen.getByTestId(testId);
  userEvent.type(input, 'banana');
  expect(input.value.length).toBe(3);
});

test('maxlength field set as a negative number or zero', () => {
  getComponent({ maxLength: null });
  const input = screen.getByTestId(testId);
  userEvent.type(input, 'banana');
  expect(input.value.length).toBe(6);
});
