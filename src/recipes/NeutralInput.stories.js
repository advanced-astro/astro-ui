import React from 'react';

import { CheckboxField } from '../index';

export default {
  title: 'Recipes/Neutral Checkbox Field',
};
const sx = {
  checkboxColor: {
    color: 'neutral.10',
  },
};

export const Default = () => (
  <CheckboxField controlProps={{ sx: sx.checkboxColor }} label="Click me" />
);
