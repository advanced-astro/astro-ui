import React from 'react';
import DropdownField from '.';
import Box from '../Box/Box';

export default {
  title: 'DropdownField',
  component: DropdownField,
};

export const Default = args => (
  <DropdownField {...args} label="Select one">
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
  </DropdownField>
);

export const withOptionGroups = args => (
  <DropdownField {...args} label="Select one">
    <optgroup label="Cheeses">
      <option>Brie</option>
      <option>Gouda</option>
      <option>Swiss</option>
    </optgroup>
    <optgroup label="Breads">
      <option>Sourdough</option>
      <option>Rye</option>
      <option>Focaccia</option>
    </optgroup>
  </DropdownField>
);

export const NoneOption = args => (
  <DropdownField {...args} label="Select one" controlProps={{ hasNoneOption: true }}>
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
  </DropdownField>
);

export const IsDisabled = args => (
  <DropdownField {...args} label="Select one" isDisabled>
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
  </DropdownField>
);

export const HelperText = args => (
  <DropdownField
    label="Select one"
    helperText="Here is some helpful text..."
    status="error"
    {...args}
  >
    <option>Option 1</option>
    <option>Option 2</option>
    <option>Option 3</option>
  </DropdownField>
);

export const Transparent = args => (
  <Box bg="neutral.90" p={20}>
    <DropdownField
      {...args}
      label="Select one"
      variant="forms.select.transparent"
    >
      <option>Option 1</option>
      <option>Option 2</option>
      <option>Option 3</option>
    </DropdownField>
  </Box>
);
