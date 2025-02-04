import React from 'react';
import { withDesign } from 'storybook-addon-designs';

import DocsLayout from '../../../.storybook/storybookDocsLayout';
import { Box, HelpHint } from '../../index';
import { FIGMA_LINKS } from '../../utils/designUtils/figmaLinks.js';

import HelpHintReadme from './HelpHint.mdx';

export default {
  title: 'Components/HelpHint',
  component: HelpHint,
  decorators: [withDesign],
  parameters: {
    docs: {
      page: () => (
        <>
          <HelpHintReadme />
          <DocsLayout />
        </>
      ),
    },
  },
  argTypes: {
    children: {
      description: 'Tooltip content',
      defaultValue: 'Text of the tooltip right here...',
      control: {
        type: 'text',
      },
    },
  },
};

export const Default = args => (
  <Box p={50}>
    <HelpHint {...args} />
  </Box>
);

Default.parameters = {
  design: {
    type: 'figma',
    url: FIGMA_LINKS.helpHint.default,
  },
};

export const WithTooltipAndIconButtonProps = () => (
  <Box p={50}>
    <HelpHint tooltipProps={{ direction: 'bottom' }} iconButtonProps={{ 'aria-label': 'Help hint' }}>
      Text of the tooltip right here...
    </HelpHint>
  </Box>
);
