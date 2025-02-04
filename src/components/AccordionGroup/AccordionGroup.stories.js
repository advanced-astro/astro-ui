import React, { useState } from 'react';
import { Item } from 'react-stately';
import { withDesign } from 'storybook-addon-designs';

import DocsLayout from '../../../.storybook/storybookDocsLayout';
import {
  AccordionGroup,
  Button,
  Text,
  TextField,
} from '../../index';
import { FIGMA_LINKS } from '../../utils/designUtils/figmaLinks.js';

import AccordionReadme from './AccordionGroup.mdx';

const itemArray = [
  { key: 't1', label: 'First Accordion', children: <Button sx={{ width: 'fit-content' }}>Secondary Button</Button> },
  { key: 't2', label: 'Second Accordion', children: 'Child Renders Here' },
  { key: 't3', label: 'Third Accordion', children: <TextField /> },
];

const itemArrayDisabled = [
  { key: 't1', label: 'Disabled Accordion', children: <Text>Hi</Text> },
  { key: 't2', label: 'Accordion', children: 'Child Renders Here' },
  { key: 't3', label: 'Disabled Accordion', children: 'Child Renders Here' },
];

export default {
  title: 'Components/AccordionGroup',
  component: AccordionGroup,
  decorators: [withDesign],
  parameters: {
    actions: {
      argTypesRegex: '^on.*',
    },
    docs: {
      page: () => (
        <>
          <AccordionReadme />
          <DocsLayout />
        </>
      ),
      source: {
        type: 'code',
      },
    },
  },
  argTypes: {
    id: {
      control: {
        type: 'text',
      },
    },
    disabledKeys: {
      description: 'The item keys that are disabled. These items cannot be selected, focused, or otherwise interacted with. Array of keys.',
    },
    defaultExpandedKeys: {},
    expandedKeys: {
      control: {
        type: 'none',
      },
    },
    items: {
      control: {
        type: 'none',
      },
    },
  },
};

export const Default = args => {
  return (
    <AccordionGroup {...args}>
      <Item key="accordionKey" textValue="accordionKey" label="Accordion Label" data-id="accordionItem">
        <Text>Render me!</Text>
      </Item>
    </AccordionGroup>
  );
};

Default.parameters = {
  design: {
    type: 'figma',
    url: FIGMA_LINKS.accordionGroup.default,
  },
};

export const Multiple = () => {
  return (
    /*
     * itemArray = [
     *   { key: 't1', label: 'First Accordion', children: <Text>Hi</Text> },
     *   { key: 't2', label: 'Second Accordion', children: 'Child Renders Here' },
     *   { key: 't3', label: 'Third Accordion', children: 'Child Renders Here' },
     * ];
     */
    <AccordionGroup items={itemArray}>
      {item => (
        <Item key={item.key} textValue={item.label} label={item.label}>
          {item.children}
        </Item>
      )}
    </AccordionGroup>
  );
};

export const ControlledExpanded = () => {
  const [expandedKeys, setExpandedKeys] = useState(['t3']);
  return (
    /*
     * itemArray = [
     *   { key: 't1', label: 'First Accordion', children: <Text>Hi</Text> },
     *   { key: 't2', label: 'Second Accordion', children: 'Child Renders Here' },
     *   { key: 't3', label: 'Third Accordion', children: 'Child Renders Here' },
     * ];
     *
     * Console Warning: "Cannot update a component (`Unknown`)...`"
     * when using controlledExpanded prop is expected
     * and related to a known issue within React Stately.
     */
    <AccordionGroup
      onExpandedChange={setExpandedKeys}
      expandedKeys={expandedKeys}
      items={itemArray}
    >
      {item => (
        <Item key={item.key} textValue={item.label} label={item.label}>
          {item.children}
        </Item>
      )}
    </AccordionGroup>
  );
};

export const UncontrolledExpanded = () => {
  return (
    /*
     * itemArray = [
     *   { key: 't1', label: 'First Accordion', children: <Text>Hi</Text> },
     *   { key: 't2', label: 'Second Accordion', children: 'Child Renders Here' },
     *   { key: 't3', label: 'Third Accordion', children: 'Child Renders Here' },
     * ];
     */
    <AccordionGroup defaultExpandedKeys={['t1']} items={itemArray}>
      {item => (
        <Item key={item.key} textValue={item.label} label={item.label}>
          {item.children}
        </Item>
      )}
    </AccordionGroup>
  );
};

export const DisabledItems = () => {
  return (
    /*
      itemArrayDisabled = [
        { key: 't1', label: 'Disabled Accordion', children: <Text>Hi</Text> },
        { key: 't2', label: 'Accordion', children: 'Child Renders Here' },
        { key: 't3', label: 'Disabled Accordion', children: 'Child Renders Here' },
      ];
     */
    <AccordionGroup disabledKeys={['t1', 't3']} items={itemArrayDisabled}>
      {item => (
        <Item key={item.key} textValue={item.label} label={item.label}>
          {item.children}
        </Item>
      )}
    </AccordionGroup>
  );
};

export const CustomPresentation = () => {
  return (
    /*
      itemArrayDisabled = [
        { key: 't1', label: 'Disabled Accordion', children: <Text>Hi</Text> },
        { key: 't2', label: 'Accordion', children: 'Child Renders Here' },
        { key: 't3', label: 'Disabled Accordion', children: 'Child Renders Here' },
      ];
     */
    <AccordionGroup items={itemArrayDisabled}>
      {item => (
        <Item
          key={item.key}
          textValue={item.label}
          label={item.label}
          buttonProps={{ bg: item.key === 't2' ? 'darkseagreen' : 'skyblue' }}
          regionProps={{ bg: 'mistyrose' }}
          containerProps={{ bg: 'lavender' }}
        >
          {item.children}
        </Item>
      )}
    </AccordionGroup>
  );
};
CustomPresentation.parameters = {
  docs: {
    description: {
      story: 'In addition to customizing the theme, prop objects can be passed to certain elements. This allows for simple customization in a pinch. See the source code below for an example.',
    },
  },
};
