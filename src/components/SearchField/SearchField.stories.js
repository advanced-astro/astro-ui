import React, { useState } from 'react';
import Users from 'mdi-react/AccountGroupIcon';
import SearchIcon from 'mdi-react/SearchIcon';

import { Box, SearchField, Text } from '../..';
import { useDebounce } from '../../hooks';
import { ariaAttributeBaseArgTypes, ariaAttributeBaseDocSettings } from '../../utils/devUtils/props/ariaAttributes';
import { inputFieldAttributeBaseArgTypes } from '../../utils/devUtils/props/fieldAttributes';

export default {
  title: 'Form/SearchField',
  component: SearchField,
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
    },
    placeholder: {
      defaultValue: 'Search Groups',
    },
    defaultValue: {},
    icon: {
      control: {
        type: 'none',
      },
    },
    isDisabled: {},
    hasAutoFocus: {},
    hasNoClearButton: {},
    autoComplete: {},
    iconProps: {},
    name: {},
    id: {},
    'aria-autocomplete': {
      table: ariaAttributeBaseDocSettings.table,
    },
    value: {
      control: {
        type: 'none',
      },
    },
    ...ariaAttributeBaseArgTypes,
    ...inputFieldAttributeBaseArgTypes,
  },
};

export const Default = args => (
  <SearchField
    {...args}
    icon={SearchIcon}
    onSubmit={text => alert(text)} // eslint-disable-line no-alert
  />
);

export const Controlled = () => {
  const [value, setValue] = useState('');
  return (
    <SearchField
      value={value}
      onChange={setValue}
      aria-label="Search Groups"
      placeholder="Search Groups"
      onSubmit={text => alert(text)} // eslint-disable-line no-alert
    />
  );
};

export const CustomIcon = () => (
  <SearchField
    icon={Users}
    aria-label="Search Users"
    placeholder="Search Users"
    onSubmit={text => alert(text)} // eslint-disable-line no-alert
  />
);

export const NoClearButton = () => (
  <SearchField
    hasNoClearButton
    aria-label="Search Users"
    placeholder="Search Users"
    onSubmit={text => alert(text)} // eslint-disable-line no-alert
  />
);

export const ControlledWithDebouncedInput = () => {
  const [value, setValue] = useState('');
  const debouncedSearchText = useDebounce({ value, delay: 500 });
  return (
    <Box>
      <SearchField
        value={value}
        onChange={setValue}
        aria-label="Search Groups"
        placeholder="Search Groups"
        onSubmit={text => alert(text)} // eslint-disable-line no-alert
      />
      <Text mt="xs">{`Debounced value: ${debouncedSearchText}`}</Text>
    </Box>
  );
};
