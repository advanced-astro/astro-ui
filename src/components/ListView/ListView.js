import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useCollator } from '@react-aria/i18n';
import { useList } from '@react-aria/list';
import { Virtualizer, VirtualizerItem } from '@react-aria/virtualizer';
import { ListLayout } from '@react-stately/layout';
import { useListState } from '@react-stately/list';
import PropTypes from 'prop-types';

import loadingStates from '../../utils/devUtils/constants/loadingStates';
import { isIterableProp } from '../../utils/devUtils/props/isIterable';
import ListViewItem from '../ListViewItem';
import Loader from '../Loader';

import { ListViewContext } from './ListViewContext';

export const collectionTypes = {
  ITEM: 'item',
  LOADER: 'loader',
  PLACEHOLDER: 'placeholder',
};

export function useListLayout(state) {
  const ROW_HEIGHT = 81;
  const collator = useCollator({ usage: 'search', sensitivity: 'base' });
  const layout = useMemo(() => new ListLayout({
    estimatedRowHeight: ROW_HEIGHT,
    estimatedHeadingHeight: 26,
    paddingRight: 4,
    paddingLeft: 4,
    loaderHeight: ROW_HEIGHT,
    placeholderHeight: ROW_HEIGHT,
    collator,
  }),
  [collator]);

  layout.collection = state.collection;
  layout.disabledKeys = state.disabledKeys;
  return layout;
}

const ListView = forwardRef((props, ref) => {
  const {
    disabledKeys,
    isHoverable = true,
    loadingState,
    onLoadMore,
    onSelectionChange,
    selectedKeys,
    selectionMode,
    selectionStyle,
    ...others
  } = props;

  const [hoveredItem, setHoveredItem] = useState(null);

  const isLoading = (
    loadingState === loadingStates.LOADING_MORE || loadingState === loadingStates.LOADING
  );
  const isFocusable = selectionMode !== 'none';

  const renderWrapper = (parent, reusableView) => (
    <VirtualizerItem
      key={reusableView.key}
      reusableView={reusableView}
      parent={parent}
    />
  );

  const listViewRef = useRef();

  /* istanbul ignore next */
  useImperativeHandle(ref, () => listViewRef.current);

  const state = useListState({
    ...props,
    selectionBehavior: selectionStyle === 'highlight' ? 'replace' : 'toggle',
  });

  state.hover = {
    hoveredItem,
    setHoveredItem,
  };

  const { collection, selectionManager } = state;

  const layout = useListLayout(state);

  const { gridProps } = useList({
    ...props,
    isVirtualized: true,
    keyboardDelegate: layout,
    loadingState,
  }, state, listViewRef);
  // Sync loading state into the layout.
  layout.isLoading = isLoading;

  const focusedKey = selectionManager.focusedKey;

  delete gridProps.onMouseDown;

  const onFocus = e => {
    gridProps.onFocus(e);

    if (others.onFocus) {
      others.onFocus(e);
    }
  };

  // This code removes hover when scrolling ListView in the Firefox browser.
  const resetHoverState = () => {
    state.hover.setHoveredItem(null);
  };

  return (
    <ListViewContext.Provider value={{ state }}>
      <Virtualizer
        {...gridProps}
        onLoadMore={onLoadMore}
        ref={listViewRef}
        focusedKey={focusedKey}
        renderWrapper={renderWrapper}
        sizeToFit="height"
        scrollDirection="vertical"
        layout={layout}
        isLoading={isLoading}
        collection={collection}
        transitionDuration={0}
        {...others}
        onFocus={isFocusable && onFocus}
        onScroll={resetHoverState}
        tabIndex={isFocusable ? 0 : -1}
        shouldUseVirtualFocus={!isFocusable}
      >
        {(type, item) => {
          if (type === 'item') {
            return (
              <ListViewItem isHoverable={isHoverable} isFocusable={isFocusable} item={item} />
            );
          } if (type === collectionTypes.LOADER) {
            return <Loader variant="loader.withinListView" aria-label="Loading more..." />;
          }
          return null;
        }}
      </Virtualizer>
    </ListViewContext.Provider>
  );
});

ListView.propTypes = {
  /** Shows loader instead of children */
  loadingState: PropTypes.oneOf(Object.values(loadingStates)),
  /**
   * The item keys that are disabled. These items cannot be selected, focused, or otherwise
   * interacted with.
   */
  disabledKeys: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  /** The list of ListView items (controlled). */
  items: isIterableProp,
  /** The element's unique identifier. See [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id). */
  id: PropTypes.string,
  /** Whether ListView should handle hover state (defaults to true) */
  isHoverable: PropTypes.bool,
  /** Defines a string value that labels the current element. */
  'aria-label': PropTypes.string,
  /** Identifies the element (or elements) that labels the current element. */
  'aria-labelledby': PropTypes.string,
  /** Identifies the element (or elements) that describes the object. */
  'aria-describedby': PropTypes.string,
  /**
   * Identifies the element (or elements) that provide a detailed, extended description for the
   * object.
  */
  'aria-details': PropTypes.string,
  /**
   * The currently selected keys in the collection (controlled).
   *
   * `selectedKeys="all"` can be used to select every key.
   */
  selectedKeys: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  /** The type of selection that is allowed in the collection. */
  selectionMode: PropTypes.oneOf(['none', 'single', 'multiple']),
  /** */
  selectionStyle: PropTypes.oneOf(['highlight', undefined]),
  /** Callback function that fires when the selected key changes. */
  onSelectionChange: PropTypes.func,
  /**
   * Handler that is called when more items should be loaded, e.g. while scrolling near the bottom.
   *
   * () => any
   */
  onLoadMore: PropTypes.func,
};

ListView.defaultProps = {
  'aria-label': 'listView',
  selectionMode: 'single',
};

export default ListView;
