import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useTreeState } from 'react-stately';
import { useAccordion } from '@react-aria/accordion';
import { mergeProps } from '@react-aria/utils';
import PropTypes from 'prop-types';

import { AccordionContext } from '../../context/AccordionContext';
import { Box } from '../../index';
import { isIterableProp } from '../../utils/devUtils/props/isIterable';
import AccordionItem from '../AccordionItem';

/**
 * Console Warning: "Cannot update a component (`Unknown`)...`"
 * when using controlledExpanded prop is expected
 * and related to a known issue within React Stately.
 */

const AccordionGroup = forwardRef((props, ref) => {
  const {
    defaultExpandedKeys,
    expandedKeys,
    onExpandedChange,
    ...others
  } = props;

  const state = useTreeState(props);
  const accordionRef = useRef();

  /* `autoFocus: true` is what makes the initial focus only take one click vs two. */
  const { accordionProps } = useAccordion({
    autoFocus: true,
    ...props,
  }, state, accordionRef);
  delete accordionProps.onMouseDown;

  /* Splicing out the onFocus function is what allows subsequent focuses to only take one click. */
  const { onFocus, ...theseProps } = accordionProps;

  /* istanbul ignore next */
  useImperativeHandle(ref, () => accordionRef.current);

  return (
    <AccordionContext.Provider value={state}>
      <Box
        ref={accordionRef}
        {...mergeProps(theseProps, others)}
      >
        {Array.from(state.collection).map(item => (
          <AccordionItem key={item.key} item={item} data-id={item['data-id']}>
            {item.props.children}
          </AccordionItem>
        ))}
      </Box>
    </AccordionContext.Provider>
  );
});

AccordionGroup.propTypes = {
  /** Handler that is called when items are expanded or collapsed. */
  onExpandedChange: PropTypes.func,
  /** Item objects in the collection. */
  items: isIterableProp,
  /**
   * The item keys that are disabled. These items cannot be selected, focused, or otherwise
   * interacted with.
   */
  disabledKeys: isIterableProp,
  /** The currently expanded keys in the collection (controlled). */
  expandedKeys: isIterableProp,
  /** The initial expanded keys in the collection (uncontrolled). */
  defaultExpandedKeys: isIterableProp,
  /** Id of the selected element */
  id: PropTypes.string,
};

AccordionGroup.displayName = 'AccordionGroup';
export default AccordionGroup;
