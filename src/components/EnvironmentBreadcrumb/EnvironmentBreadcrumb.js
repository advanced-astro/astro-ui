import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FocusScope, mergeProps, useOverlayPosition, useOverlayTrigger } from 'react-aria';
import { useOverlayTriggerState } from 'react-stately';
import ArrowDropDownIcon from '@pingux/mdi-react/ArrowDropDownIcon';
import ArrowDropUpIcon from '@pingux/mdi-react/ArrowDropUpIcon';
import ChevronRightIcon from '@pingux/mdi-react/ChevronRightIcon';
import HomeIcon from '@pingux/mdi-react/HomeIcon';
import { useFilter } from '@react-aria/i18n';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { useListState } from '@react-stately/list';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

import { useDebounce } from '../../hooks';
import {
  Breadcrumbs,
  Button,
  Icon,
  Item,
  PopoverContainer,
  ScrollBox,
  SearchField,
  Text,
} from '../../index';
import { isIterableProp } from '../../utils/devUtils/props/isIterable';
import ListBox from '../ListBox';

export const breadCrumbDataIds = {
  dropdownList: 'breadcrumb--dropdown-list',
  environmentButton: 'breadcrumb--environment-button',
  orgButton: 'breadcrumb--org-button',
};

const EnvironmentBreadcrumb = forwardRef((props, ref) => {
  const {
    children,
    disabledKeys: imperativeDisabledKeys,
    emptySearchText,
    isDefaultOpen,
    isOpen,
    items,
    itemsFilter: imperativeItemsFilter,
    name,
    onFilteredOptionsNumber,
    onNamePress,
    onOpenChange,
    optionsCountMessage,
    onPopoverClose: imperativeOnPopoverClose,
    onPopoverOpen: imperativeOnPopoverOpen,
    onSelectionChange,
    popoverProps,
    searchProps,
    selectedItem,
    ...others
  } = props;

  const optionsNumberMessageId = useMemo(() => uuid(), []);

  const [searchValue, setSearchValue] = useState('');
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const breadcrumbsRef = useRef();
  const overlayRef = React.useRef();
  const triggerRef = React.useRef();
  const scrollBoxRef = React.useRef();

  /* istanbul ignore next */
  useImperativeHandle(ref, () => breadcrumbsRef.current);

  const { contains } = useFilter({ sensitivity: 'base' });
  const filterNodesWithChildren = iterableNode => {
    const nodeArr = Array.from(iterableNode);

    // with this function we are filtering child items if they have sections
    // we can't filter items because if it would be a section - we can't change childNodes
    const filteredSections = nodeArr.map(function f(nodeItem) {
      if (nodeItem?.type === 'item') {
        return contains(nodeItem?.value?.name, searchValue) && nodeItem;
      }


      const childNodes = Array.from(nodeItem.childNodes).filter(f);
      // Don't return sections without children, see UIP-5951
      return childNodes.length !== 0 && {
        ...nodeItem,
        childNodes,
      };
    });

    // we are filtering null items here since we were not able to filter them in previous function
    return filteredSections.filter(item => item);
  };

  const popoverState = useOverlayTriggerState({
    defaultOpen: isDefaultOpen,
    isOpen,
    onOpenChange,
  });

  const handlePopoverClose = useCallback(() => {
    if (imperativeOnPopoverClose) {
      imperativeOnPopoverClose();
    }
    setSearchValue('');
    popoverState.close();
  }, [imperativeOnPopoverClose, popoverState]);

  const handleSelectionChange = useCallback(
    selectedItemSet => {
      const [selectedItemKey] = selectedItemSet;
      setSelectedKeys(selectedItemSet);
      onSelectionChange(selectedItemKey);
      handlePopoverClose();
    },
    [handlePopoverClose, onSelectionChange],
  );

  const listBoxProps = {
    children,
    disabledKeys: imperativeDisabledKeys,
    items,
    filter: imperativeItemsFilter || filterNodesWithChildren,
    onSelectionChange: handleSelectionChange,
    selectedKeys,
    selectionMode: 'single',
    disallowEmptySelection: false,
  };

  const listBoxState = useListState(listBoxProps);

  // this function is recursively going through the children to see
  // whether there are some items so that means that the array isn't empty
  const checkIfListEmpty = useCallback(() => {
    // from the beginning we are assuming that the list is empty
    // variable is not isListEmpty because checks below if(isListHasItems) is clearer
    // to read than if(!isListEmpty) IMO
    let isListHasItems = false;
    // eslint-disable-next-line consistent-return
    (function f(listState) {
      // if the list has items - we don't need to go deeper into the recursion
      if (isListHasItems) {
        return;
      }
      // here we are checking where are listItems array is stored
      const listItemsArr = listState?.collection?.iterable || listState?.childNodes;

      if (listItemsArr?.length > 0) {
        // if there are a few listItems we are checking their types (can be sections) - if we have
        // a few of 'items' type - we know that the list is not empty
        if (listItemsArr[0].type === 'item') {
          isListHasItems = true;
        } else {
          // this path will be taken if there are a few 'sections'
          // - we need to go check them recursively
          listItemsArr.forEach(item => f(item));
        }
      }
    }(listBoxState));
    return !isListHasItems;
  }, [listBoxState]);

  const { triggerProps, overlayProps } = useOverlayTrigger(
    {
      type: 'listbox',
    },
    popoverState,
    triggerRef,
  );
  const handlePopoverOpen = () => {
    if (imperativeOnPopoverOpen) {
      imperativeOnPopoverOpen();
    }
    popoverState.open();
  };

  const { overlayProps: positionProps } = useOverlayPosition({
    isOpen: popoverState.isOpen,
    offset: 6,
    onClose: handlePopoverClose,
    overlayRef,
    scrollRef: scrollBoxRef,
    shouldUpdatePosition: true,
    targetRef: triggerRef,
  });

  const EmptyListState = (
    <Text py={10} px={15}>
      {emptySearchText}
    </Text>
  );
  const setAriaLabel = itemKey => {
    if (itemKey !== undefined) {
      return (popoverState.isOpen ? `${selectedItem.key} - Collapse Options` : `${selectedItem.key} - Expand Options`);
    }
    return selectedItem;
  };

  const getFilteredOptionsNumber = useCallback(() => {
    const nodeArr = Array.from(listBoxState.collection.iterable);
    if (nodeArr.length === 0) return 0;
    const itemsCount = nodeArr.reduce((acc, node) => {
      if (node.type === 'section') return acc + node.childNodes.length;
      return acc + 1;
    }, 0);
    return itemsCount;
  }, [listBoxState.collection.iterable]);

  useEffect(() => {
    if (onFilteredOptionsNumber) {
      onFilteredOptionsNumber(getFilteredOptionsNumber());
    }
  }, [onFilteredOptionsNumber, getFilteredOptionsNumber, listBoxState.collection]);

  useEffect(() => {
    setIsTyping(true);
    const handler = setTimeout(() => {
      setIsTyping(false);
    }, [1000]);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  const optionsMessage = () => {
    const totalOptionsNumber = items && items.length;
    const filteredOptionsNumber = getFilteredOptionsNumber();
    const message = filteredOptionsNumber === totalOptionsNumber
      ? `${totalOptionsNumber} options in total`
      : `${filteredOptionsNumber} of ${totalOptionsNumber} options for "${searchValue}"`;
    return message;
  };

  const ItemsSelect = (
    <>
      <Button
        {...triggerProps}
        onPress={handlePopoverOpen}
        ref={triggerRef}
        variant="variants.environmentBreadcrumb.button.current"
        aria-label={setAriaLabel(selectedItem)}
        data-id={breadCrumbDataIds.environmentButton}
      >
        {selectedItem}
        <Icon
          icon={popoverState.isOpen ? ArrowDropUpIcon : ArrowDropDownIcon}
          title={{ name: popoverState.isOpen ? 'Arrow Drop Up Icon' : 'Arrow Drop Down Icon' }}
        />
      </Button>
      <PopoverContainer
        {...overlayProps}
        {...positionProps}
        {...mergeProps(overlayProps, positionProps, popoverProps)}
        ref={overlayRef}
        isOpen={popoverState.isOpen}
        scrollRef={scrollBoxRef}
        onClose={handlePopoverClose}
        hasNoArrow
        isDismissable
        p={10}
      >
        <FocusScope restoreFocus autoFocus contain>
          <SearchField
            aria-describedby={optionsNumberMessageId}
            autocomplete="off"
            placeholder="Search"
            aria-label="Items Search"
            data-testid="Environment-Breadcrumb-Search"
            onChange={setSearchValue}
            {...searchProps}
          />
          <VisuallyHidden role="alert" aria-live="polite" aria-busy={isTyping} id={optionsNumberMessageId}>
            {useDebounce({ value: optionsCountMessage || optionsMessage(), delay: 1000 })}
          </VisuallyHidden>
          <ScrollBox ref={scrollBoxRef}>
            {checkIfListEmpty() ? (
              EmptyListState
            ) : (
              <ListBox
                aria-label="Items List"
                data-id={breadCrumbDataIds.dropdownList}
                state={listBoxState}
              />
            )}
          </ScrollBox>
        </FocusScope>
      </PopoverContainer>
    </>
  );

  const handleOnAction = useCallback(
    actionKey => {
      if (actionKey === 'name' && onNamePress) {
        onNamePress();
      }
    },
    [onNamePress],
  );

  return (
    <Breadcrumbs
      icon={ChevronRightIcon}
      ref={breadcrumbsRef}
      onAction={handleOnAction}
      iconProps={{
        color: 'neutral.70',
        mx: 5,
        size: 'xs',
      }}
      {...others}
    >
      <Item
        key="name"
        variant="variants.environmentBreadcrumb.button.current"
        data-testid="name"
        aria-label={name}
        data-id={breadCrumbDataIds.orgButton}
        elementType="Button"
      >
        <Icon icon={HomeIcon} mr={7} title={{ name: 'Home Icon' }} />
        {name}
      </Item>
      {selectedItem && (
        <Item key="itemsSelect" elementType="Fragment">
          {ItemsSelect}
        </Item>
      )}
    </Breadcrumbs>
  );
});

export default EnvironmentBreadcrumb;

EnvironmentBreadcrumb.propTypes = {
  /** Callback function that fires when the selected key changes. */
  onSelectionChange: PropTypes.func,
  /** Current environment */
  selectedItem: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /** Displayed name */
  name: PropTypes.string,
  /** Callback function that fires when name pressed */
  onNamePress: PropTypes.func,
  /** The list of environments. */
  items: isIterableProp,
  /**
   * Filter function to generate a filtered list of nodes.
   *
   * `(nodes: Iterable<Node>) => Iterable<Node>`
   */
  itemsFilter: PropTypes.func,
  /** Callback function that fires when the dropdown is opened. */
  onPopoverOpen: PropTypes.func,
  /** Callback function that fires when the dropdown is closed. */
  onPopoverClose: PropTypes.func,
  /** Props object that is spread directly into the popover container component. */
  popoverProps: PropTypes.shape({}),
  /** Props object that is spread directly into the SearchField element. */
  searchProps: PropTypes.shape({}),
  /** Array of keys to disable within the options list. */
  disabledKeys: PropTypes.arrayOf(PropTypes.string),
  /** Text that will be shown if no search results found. */
  emptySearchText: PropTypes.string,
  /** Sets the default open state of the overlay. */
  isDefaultOpen: PropTypes.bool,
  /** Whether the overlay is currently open. */
  isOpen: PropTypes.bool,
  /**
   * Method that is called when the open state of the menu changes.
   *
   * `(isOpen: boolean, overlayTrigger: OverlayTriggerAction) => void`
   */
  onOpenChange: PropTypes.func,
  /** Callback function that returns number of filtered options. */
  onFilteredOptionsNumber: PropTypes.func,
  /** Message to announce number of available options by screen reader. */
  optionsCountMessage: PropTypes.string,
};

EnvironmentBreadcrumb.defaultProps = {
  emptySearchText: 'No Search Result',
};
