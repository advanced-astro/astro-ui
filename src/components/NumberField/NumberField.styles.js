import { input } from '../Input/Input.styles';

const sharedStyles = {
  WebkitAppearance: 'none',
  margin: 0,
};

const noDefaultArrows = {
  'input::-webkit-outer-spin-button': { ...sharedStyles },
  'input::-webkit-inner-spin-button': {
    ...sharedStyles,
  },
  'input[type=number]': {
    MozAppearance: 'textfield',
  },
};

const arrowsWrapper = {
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
  ...input.fieldContainer,
};

const arrows = {
  position: 'absolute',
  right: '10px',
};

export default {
  arrowsWrapper,
  arrows,
  noDefaultArrows,
};
