import React, { useEffect, useState } from 'react';

import DocsLayout from '../../../.storybook/storybookDocsLayout';
import {
  Box,
  CheckboxField,
  Link,
  Text,
} from '../../index';
import { ariaAttributeBaseArgTypes } from '../../utils/docUtils/ariaAttributes';
import { inputFieldAttributeBaseArgTypes } from '../../utils/docUtils/fieldAttributes';
import { statusArgTypes } from '../../utils/docUtils/statusProp';

import CheckboxFieldReadme from './CheckboxField.mdx';

export default {
  title: 'Form/CheckboxField',
  component: CheckboxField,
  parameters: {
    docs: {
      page: () => (
        <>
          <CheckboxFieldReadme />
          <DocsLayout />
        </>
      ),
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
      defaultValue: 'Click me!',
    },
    helperText: {
      control: {
        type: 'text',
      },
    },
    hintText: {
      control: {
        type: 'text',
      },
    },
    name: {},
    id: {
      control: {
        type: 'text',
      },
    },
    value: {},
    isRequired: {},
    isDisabled: {},
    isReadOnly: {},
    hasAutoFocus: {},
    isIndeterminate: {},
    isDefaultSelected: {},
    isSelected: {},
    ...statusArgTypes,
    ...ariaAttributeBaseArgTypes,
    ...inputFieldAttributeBaseArgTypes,
  },
};

export const Default = args => (
  <CheckboxField
    {...args}
  />
);

export const DefaultSelected = () => (
  <CheckboxField
    isDefaultSelected
    label="Click me"
  />
);

export const Controlled = () => {
  const [isSelected, setSelected] = React.useState(false);
  return (
    <CheckboxField
      isSelected={isSelected}
      onChange={setSelected}
      label="Click me"
    />
  );
};

export const Required = () => (
  <CheckboxField
    isRequired
    label={(
      <Text>
        I agree to the
        {' '}
        <Link href="https://pingidentity.com" target="_blank">Terms and Conditions</Link>
      </Text>
    )}
  />
);

export const HelperText = () => (
  <CheckboxField
    status="error"
    helperText="Here is some helpful text..."
    label="Click me"
  />
);

export const Indeterminate = () => {
  // Whether the parent checkbox is indeterminate (default is true for our example)
  const [isIndeterminate, setIsIndeterminate] = useState(true);
  // Whether the parent checkbox should be checked, this is set independently from indeterminism
  const [isCompleted, setIsCompleted] = useState(false);
  // The state of the sub-checkboxes
  const [subCheckboxes, setSubCheckboxes] = useState([
    {
      label: 'Apple Chunks',
      isSelected: true,
    }, {
      label: 'Blueberries',
      isSelected: false,
    }, {
      label: 'Grapes',
      isSelected: false,
    }, {
      label: 'Strawberry Slices',
      isSelected: true,
    },
  ]);

  // Determine which checkbox needs its state updated
  const handleSubCheckboxChange = (isSelected, changedIndex, changeAll = false) => {
    const newSubCheckboxes = subCheckboxes.map((checkbox, index) => {
      if (changeAll || index === changedIndex) return ({ ...checkbox, isSelected });
      return checkbox;
    });

    setSubCheckboxes(newSubCheckboxes);
  };

  // Update all sub-checkbox states when the parent checkbox is pressed
  const handleParentCheckboxChange = isSelected => {
    handleSubCheckboxChange(isSelected, null, true);
  };


  useEffect(() => {
    // Determine if all sub-checkboxes are selected / unselected or if there is a mix
    // and update the parent checkbox
    if (subCheckboxes.every(item => item.isSelected)) {
      setIsIndeterminate(false);
      setIsCompleted(true);
    } else if (subCheckboxes.every(item => !item.isSelected)) {
      setIsIndeterminate(false);
      setIsCompleted(false);
    } else {
      setIsIndeterminate(true);
      setIsCompleted(false);
    }
  }, [isIndeterminate, subCheckboxes]);


  return (
    <>
      <CheckboxField
        label="Fruit Salad Recipe"
        isIndeterminate={isIndeterminate}
        isSelected={isCompleted}
        onChange={handleParentCheckboxChange}
      />
      <Box ml="lg">
        {subCheckboxes.map((checkbox, index) => (
          <CheckboxField
            key={checkbox.label}
            label={checkbox.label}
            isSelected={checkbox.isSelected}
            onChange={isSelected => handleSubCheckboxChange(isSelected, index)}
          />
        ))}
      </Box>
    </>
  );
};

Indeterminate.parameters = {
  docs: {
    description: {
      story: 'When a `CheckboxField` is indeterminate, it\'s necessary to control the state in order to determine how it should function when pressed. Here is an example of how to do that.',
    },
  },
};
