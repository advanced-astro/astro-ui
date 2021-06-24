import React from 'react';
import userEvent from '@testing-library/user-event';

import { active, accent, neutral, white } from '../../styles/colors';
import { render, screen, fireEvent } from '../../utils/testUtils/testWrapper';

import Text from '../Text';

import Stepper from './Stepper';
import Step from './Step';
import { stepStatuses } from './Stepper.constants';

const {
  ACTIVE,
  INACTIVE,
} = stepStatuses;

const styles = {
  [ACTIVE]: `background-color: ${accent[95]}; border-color: ${active}; color: ${active}`,
  [INACTIVE]: `background-color: ${white}; border-color: ${neutral[80]}; color: ${neutral[40]}`,
};

const steps = [
  { label: 'Name', children: 'Step 1', name: 'step1' },
  { label: 'Object', children: 'Step 2', name: 'step2' },
  { label: 'Content', children: 'Step 3', name: 'step3' },
];

const testId = 'test-stepper';

const defaultProps = {
  'data-testid': testId,
  activeStep: 1,
  items: steps,
};

const getComponent = (props = {}, { renderFn = render } = {}) => renderFn(
  <Stepper {...defaultProps} {...props}>
    {item => (
      <Step key={item.name} textValue={item.name}>
        <Text>{item.children}</Text>
      </Step>
    )}
  </Stepper>,
);

test('renders Stepper component in the default state', () => {
  getComponent();
  const stepper = screen.getByTestId(testId);
  expect(stepper).toBeInstanceOf(HTMLDivElement);
  expect(stepper).toBeInTheDocument();

  const expectedStatuses = [ACTIVE, INACTIVE, INACTIVE];
  steps.forEach((_v, i) => {
    const stepIndex = i + 1;
    const step = screen.getByText(`${stepIndex}`);
    expect(step).toBeInTheDocument();
    expect(step).toHaveStyle(styles[expectedStatuses[i]]);
  });
});

test('should throw an error when float number passed as an active step', () => {
  const activeStep = 1.5;
  expect(() => getComponent({ activeStep })).toThrow(`instead received \`${activeStep}\``);
});

test('renders the stepper with the given active step', () => {
  const activeStep = 2;
  getComponent({ activeStep });
  const step = screen.getByText(`${activeStep}`);
  expect(step).toBeInTheDocument();
  expect(step).toHaveStyle(styles[ACTIVE]);
});

const getTabs = () => {
  const tabs = screen.queryAllByRole('tab');
  const [tab0, tab1, tab2] = tabs;
  return { tabs, tab0, tab1, tab2 };
};

test('click should fire `onStepChange` handler', () => {
  const onStepChange = jest.fn();

  getComponent({ onStepChange });
  const { tab1 } = getTabs();
  userEvent.click(tab1);
  expect(onStepChange).toHaveBeenCalled();
});

test('`onStepChange` get as first arg number of clicked step', () => {
  const onStepChange = jest.fn();

  getComponent({ onStepChange });
  const { tab2 } = getTabs();
  userEvent.click(tab2);
  expect(onStepChange).toHaveBeenCalledWith(3);
});

test('tooltip renders expected content based on props', () => {
  // Should render label
  const { rerender } = getComponent();
  let { tab0 } = getTabs();
  fireEvent.mouseMove(tab0);
  fireEvent.mouseEnter(tab0);
  expect(screen.queryByRole('tooltip')).toBeInTheDocument();
  expect(screen.queryByRole('tooltip')).toHaveTextContent(steps[0].label);

  // Should render textValue
  const stepsWithoutLabels = steps.map((step) => {
    const copy = step;
    delete copy.label;
    return copy;
  });
  getComponent({ items: stepsWithoutLabels }, { renderFn: rerender });
  ({ tab0 } = getTabs());
  fireEvent.mouseMove(tab0);
  fireEvent.mouseEnter(tab0);
  expect(screen.queryByRole('tooltip')).toBeInTheDocument();
  expect(screen.queryByRole('tooltip')).toHaveTextContent(steps[0].name);

  // Should render index
  const stepsWithNeither = stepsWithoutLabels.map((step) => {
    const copy = step;
    delete copy.name;
    return copy;
  });
  getComponent({ items: stepsWithNeither }, { renderFn: rerender });
  ({ tab0 } = getTabs());
  fireEvent.mouseMove(tab0);
  fireEvent.mouseEnter(tab0);
  expect(screen.queryByRole('tooltip')).toBeInTheDocument();
  expect(screen.queryByRole('tooltip')).toHaveTextContent('1');
});