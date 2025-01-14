import React, { useState } from 'react';

import DocsLayout from '../../../.storybook/storybookDocsLayout';
import {
  Badge,
  Box,
  EnvironmentBreadcrumb,
  Item,
  Section,
  Text,
} from '../../index';

import EnvironmentBreadcrumbReadme from './EnvironmentBreadcrumb.mdx';

export default {
  title: 'Components/EnvironmentBreadcrumb',
  component: EnvironmentBreadcrumb,
  parameters: {
    docs: {
      page: () => (
        <>
          <EnvironmentBreadcrumbReadme />
          <DocsLayout />
        </>
      ),
      source: {
        type: 'code',
      },
    },
  },
};

const defaultEnvironments = [
  { name: 'Default' },
  { name: 'Kangaroo' },
  { name: 'Snake' },
  { name: 'Snail' },
  { name: 'Slug' },
  { name: 'Crow' },
  { name: 'Dog' },
  { name: 'Crab', isSandbox: true },
  { name: 'Fish' },
  { name: 'Turtle' },
  { name: 'Mouse' },
  { name: 'Banana' },
  { name: 'Shark' },
  { name: 'Gorilla' },
  { name: 'Goat' },
];

const environmentsWithSections = [
  {
    name: 'Recent',
    key: 'Recent',
    options: [
      { name: 'Default' },
      { name: 'Consumer Banking Prod' },
      { name: 'Custom 360 Test' },
    ],
  },
  {
    name: 'All',
    key: 'All',
    options: [
      { name: 'Consumer Banking Prod' },
      { name: 'Custom 360 Test' },
      { name: 'Default' },
      { name: 'Great New One', isSandbox: true },
      { name: 'Jeff’s Workforce' },
      { name: 'Lindemuller Prod' },
      { name: 'Mine' },
    ],
  },
  {
    name: 'Other',
    key: 'Other',
    options: [
      { name: 'Default' },
      { name: 'Auth test', isSandbox: true },
      { name: 'Mike’s Workforce' },
    ],
  },
];

export const Default = args => {
  const [selectedEnvironment, setSelectedEnvironment] = useState({
    name: 'Snail',
    isSandbox: true,
  });

  const envNode = (
    <Box isRow key={selectedEnvironment.name}>
      <Text color="inherit">{selectedEnvironment.name}</Text>
      {selectedEnvironment.isSandbox ? (
        <Badge label="SANDBOX" variant="environmentBadge" bg="neutral.40" />
      ) : null}
    </Box>
  );

  const findEnvObj = envName => defaultEnvironments.find(({ name }) => name === envName);

  const handleSelectionChange = newEnvName => {
    const envObj = findEnvObj(newEnvName);
    setSelectedEnvironment({ ...envObj });
  };

  return (
    <EnvironmentBreadcrumb
      {...args}
      items={defaultEnvironments}
      name="Globochem"
      selectedItem={envNode}
      onSelectionChange={handleSelectionChange}
    >
      {({ name, isSandbox }) => (
        <Item key={name} textValue={name}>
          {name}
          {isSandbox ? (
            <Badge
              label="SANDBOX"
              variant="environmentBadge"
              bg="neutral.40"
            />
          ) : null}
        </Item>
      )}
    </EnvironmentBreadcrumb>
  );
};

export const DefaultClosed = args => {
  const [selectedEnvironment, setSelectedEnvironment] = useState({
    name: 'Snail',
    isSandbox: true,
  });

  const envNode = (
    <Box isRow key={selectedEnvironment.name}>
      <Text color="inherit">{selectedEnvironment.name}</Text>
      {selectedEnvironment.isSandbox ? (
        <Badge label="SANDBOX" variant="environmentBadge" bg="neutral.40" />
      ) : null}
    </Box>
  );

  const findEnvObj = envName => defaultEnvironments.find(({ name }) => name === envName);

  const handleSelectionChange = newEnvName => {
    const envObj = findEnvObj(newEnvName);
    setSelectedEnvironment({ ...envObj });
  };

  return (
    <EnvironmentBreadcrumb
      {...args}
      items={defaultEnvironments}
      name="Globochem"
      selectedItem={envNode}
      onSelectionChange={handleSelectionChange}
    >
      {({ name, isSandbox }) => (
        <Item key={name} textValue={name}>
          {name}
          {isSandbox ? (
            <Badge
              label="SANDBOX"
              variant="environmentBadge"
              bg="neutral.40"
            />
          ) : null}
        </Item>
      )}
    </EnvironmentBreadcrumb>
  );
};

export const WithSections = () => {
  const [environments, setEnvironments] = useState(environmentsWithSections);
  const [filteredOptionsNumber, setFilteredOptionsNumber] = useState(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState({
    name: 'Consumer Banking Prod',
  });
  const recentEnvShown = 3;
  const totalOptionsNumber = environmentsWithSections.reduce(
    (acc, section) => acc + section.options.length, 0);
  const optionsCountMessage = filteredOptionsNumber === totalOptionsNumber
    ? `${totalOptionsNumber} options in total`
    : `${filteredOptionsNumber} of ${totalOptionsNumber} options`;

  const getUpdatedRecentEnvs = (envObj, prevEnvs) => {
    const { name: envName } = envObj;

    const isDuplicate = prevEnvs.filter(prevEnv => prevEnv.name === envName).length > 0;

    if (isDuplicate) {
      return [
        { ...envObj },
        ...prevEnvs.filter(prevEnv => prevEnv.name !== envName),
      ];
    }
    if (prevEnvs.length >= recentEnvShown) {
      return [{ ...envObj }, ...prevEnvs.slice(0, recentEnvShown - 1)];
    }
    return [{ ...envObj }, ...prevEnvs];
  };

  const findEnvObj = (envName, envSectionName) => {
    return environments
      .find(section => section.name === envSectionName)
      .options.find(option => option.name === envName);
  };

  const handleEnvPress = newEnv => {
    const sectionPrefixIndex = newEnv.indexOf('-');
    const envKey = newEnv.substr(sectionPrefixIndex + 1);
    const envSectionName = newEnv.substr(0, sectionPrefixIndex);
    const recentEnvironments = environments.find(
      envSection => envSection.name === 'Recent',
    ).options;
    const envObj = findEnvObj(envKey, envSectionName);
    const updatedRecentEnvironments = getUpdatedRecentEnvs(
      envObj,
      recentEnvironments,
    );
    setEnvironments(prevEnvs => prevEnvs.map(section => (section.name === 'Recent'
      ? { ...section, options: updatedRecentEnvironments }
      : section),
    ),
    );
    setSelectedEnvironment({ ...envObj });
  };

  const envNode = (
    <Box isRow key={selectedEnvironment.name}>
      <Text color="inherit">{selectedEnvironment.name}</Text>
      {selectedEnvironment.isSandbox ? (
        <Badge label="SANDBOX" variant="environmentBadge" bg="neutral.40" />
      ) : null}
    </Box>
  );

  return (
    <EnvironmentBreadcrumb
      items={environments}
      name="Globochem"
      selectedItem={envNode}
      onSelectionChange={handleEnvPress}
      onFilteredOptionsNumber={setFilteredOptionsNumber}
      optionsCountMessage={optionsCountMessage}
      isDefaultOpen
    >
      {({ name: sectionName, options: sectionOptions, key: sectionKey }) => (
        <Section
          key={sectionKey}
          title={sectionName}
          items={sectionOptions}
        >
          {({ name: itemName, options: itemOptions, isSandbox }) => (
            <Item
              key={`${sectionName}-${itemName}`}
              childItems={itemOptions}
              textValue={itemName}
            >
              <Box isRow>
                {itemName}
                {isSandbox ? (
                  <Badge
                    label="SANDBOX"
                    variant="environmentBadge"
                    bg="neutral.40"
                  />
                ) : null}
              </Box>
            </Item>
          )}
        </Section>
      )}
    </EnvironmentBreadcrumb>
  );
};

export const OrgLevel = () => <EnvironmentBreadcrumb name="Globochem" />;

export const DefaultOpen = () => {
  const [selectedEnvironment, setSelectedEnvironment] = useState({
    name: 'Dog',
    isSandbox: true,
  });

  const envNode = (
    <Box isRow key={selectedEnvironment.name}>
      <Text color="inherit">{selectedEnvironment.name}</Text>
      {selectedEnvironment.isSandbox ? (
        <Badge label="SANDBOX" variant="environmentBadge" bg="neutral.40" />
      ) : null}
    </Box>
  );

  const findEnvObj = envName => defaultEnvironments.find(({ name }) => name === envName);

  const handleSelectionChange = newEnvName => {
    const envObj = findEnvObj(newEnvName);
    setSelectedEnvironment({ ...envObj });
  };

  return (
    <EnvironmentBreadcrumb
      items={defaultEnvironments}
      name="Globochem"
      selectedItem={envNode}
      onSelectionChange={handleSelectionChange}
      isDefaultOpen
    >
      {({ name, isSandbox }) => (
        <Item key={name} textValue={name}>
          {name}
          {isSandbox ? (
            <Badge
              label="SANDBOX"
              variant="environmentBadge"
              bg="neutral.40"
            />
          ) : null}
        </Item>
      )}
    </EnvironmentBreadcrumb>
  );
};

export const ControlledMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState({
    name: 'Shark',
    isSandbox: true,
  });

  const envNode = (
    <Box isRow key={selectedEnvironment.name}>
      <Text color="inherit">{selectedEnvironment.name}</Text>
      {selectedEnvironment.isSandbox ? (
        <Badge label="SANDBOX" variant="environmentBadge" bg="neutral.40" />
      ) : null}
    </Box>
  );

  const findEnvObj = envName => defaultEnvironments.find(({ name }) => name === envName);

  const handleSelectionChange = newEnvName => {
    const envObj = findEnvObj(newEnvName);
    setSelectedEnvironment({ ...envObj });
  };

  return (
    <EnvironmentBreadcrumb
      items={defaultEnvironments}
      name="Globochem"
      selectedItem={envNode}
      onSelectionChange={handleSelectionChange}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      {({ name, isSandbox }) => (
        <Item key={name} textValue={name}>
          {name}
          {isSandbox ? (
            <Badge
              label="SANDBOX"
              variant="environmentBadge"
              bg="neutral.40"
            />
          ) : null}
        </Item>
      )}
    </EnvironmentBreadcrumb>
  );
};

export const RightAlignedBadges = args => {
  const [selectedEnvironment, setSelectedEnvironment] = useState({
    name: 'Snail',
    isSandbox: true,
  });

  const envNode = (
    <Box isRow>
      <Text color="inherit">{selectedEnvironment.name}</Text>
      {selectedEnvironment.isSandbox ? (
        <Badge label="SANDBOX" variant="environmentBadge" bg="neutral.40" />
      ) : null}
    </Box>
  );

  const findEnvObj = envName => defaultEnvironments.find(({ name }) => name === envName);

  const handleSelectionChange = newEnvName => {
    const envObj = findEnvObj(newEnvName);
    setSelectedEnvironment({ ...envObj });
  };

  const items = [
    { name: 'Default' },
    { name: 'Kangaroo', isSandbox: true },
    { name: 'Snake', isSandbox: true },
    { name: 'Snail' },
    { name: 'Slug', isSandbox: true },
    { name: 'Crow' },
    { name: 'Dog' },
    { name: 'Crab', isSandbox: true },
    { name: 'Fish', isSandbox: true },
    { name: 'Turtle', isSandbox: true },
    { name: 'Mouse' },
  ];

  return (
    <EnvironmentBreadcrumb
      {...args}
      items={items}
      name="Globochem"
      selectedItem={envNode}
      onSelectionChange={handleSelectionChange}
    >
      {({ name, isSandbox }) => (
        <Item key={name} textValue={name}>
          {name}
          {isSandbox ? (
            <Badge
              label="SANDBOX"
              variant="environmentBadge"
              bg="neutral.40"
              align="right"
            />
          ) : null}
        </Item>
      )}
    </EnvironmentBreadcrumb>
  );
};
