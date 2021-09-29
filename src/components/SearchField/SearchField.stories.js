import React, { useState } from 'react';
import { Users } from '@pingux/icons';
import SearchIcon from 'mdi-react/SearchIcon';


import SearchField from '.';

export default {
  title: 'Form/SearchField',
  component: SearchField,
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
    autocomplete: {},
    containerProps: {},
    iconProps: {},
    controlProps: {},
    labelProps: {},
    name: {},
    id: {},
    'aria-label': {
      control: {
        type: 'text',
      },
    },
    'aria-labelledby': {
      control: {
        type: 'text',
      },
    },
    'aria-autocomplete': {},
    value: {
      control: {
        type: 'none',
      },
    },
  },
};

export const Default = args => (
  <SearchField
    {...args}
    icon={SearchIcon}
    aria-label="Search Groups"
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
