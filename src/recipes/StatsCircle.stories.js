import React from 'react';

import { Box, Text } from '../index';
import { active } from '../styles/colors';

export default {
  title: 'Recipes/Stats Circle',
};

const sx = {
  statsCircle: {
    border: '3px solid',
    borderColor: active,
    borderRadius: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export const Default = () => (
  <Box
    width="110px"
    height="110px"
    sx={sx.statsCircle}
  >
    <Text fontSize={30}>63</Text>
    <Text color="text.secondary">Members</Text>
  </Box>
);
