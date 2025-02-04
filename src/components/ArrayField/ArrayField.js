import React, { useCallback, useState } from 'react';
import { mergeProps, useLabel } from 'react-aria';
import PropTypes from 'prop-types';
import { v4 as uuid } from 'uuid';

import { Box, Button, FieldHelperText, Label, Text } from '../..';
import statuses from '../../utils/devUtils/constants/statuses';
import isValidPositiveInt from '../../utils/devUtils/props/isValidPositiveInt';
import { ariaAttributesBasePropTypes, getAriaAttributeProps } from '../../utils/docUtils/ariaAttributes';
import { statusPropTypes } from '../../utils/docUtils/statusProp';

const ArrayField = props => {
  const {
    addButtonLabel,
    defaultValue,
    value,
    label,
    helperText,
    status,
    onAdd,
    onChange,
    onDelete,
    renderField,
    labelProps,
    maxSize,
    maxSizeText,
    ...others
  } = props;

  const valueRef = React.useRef(value);
  valueRef.current = value;

  const onAddRef = React.useRef(onAdd);
  onAddRef.current = onAdd;

  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  const onDeleteRef = React.useRef(onDelete);
  onDeleteRef.current = onDelete;

  const isControlled = value !== undefined;

  const createEmptyField = useCallback(() => {
    return { id: uuid(), value: '' };
  }, []);

  const [fieldValues, setFieldValues] = useState(defaultValue || [createEmptyField()]);

  const mapArrayFieldWithNewValue = useCallback(
    (arrValues, newValue, fieldId) => arrValues.map(fieldValue => {
      if (fieldValue.id === fieldId) {
        return { ...fieldValue, value: newValue };
      }
      return fieldValue;
    }),
    [],
  );

  const onFieldValueChange = useCallback(
    (event, fieldId) => {
      let tempValue = event;
      // Checks if value received is a key or event
      if (typeof event !== 'string') {
        tempValue = event.target.value;
      }
      if (isControlled) {
        onChangeRef.current(mapArrayFieldWithNewValue(valueRef.current, tempValue, fieldId));
      } else {
        setFieldValues(oldValues => mapArrayFieldWithNewValue(oldValues, tempValue, fieldId));
      }
    },
    [isControlled, mapArrayFieldWithNewValue],
  );

  const onFieldDelete = useCallback(
    fieldId => {
      if (isControlled) {
        onDeleteRef.current(fieldId);
      } else {
        setFieldValues(oldValues => oldValues.filter(({ id }) => id !== fieldId),
        );
      }
    },
    [isControlled],
  );

  const onFieldAdd = useCallback(() => {
    if (isControlled) {
      return onAddRef.current();
    }

    return setFieldValues(oldValues => [...oldValues, createEmptyField()]);
  }, [createEmptyField, isControlled]);

  const {
    labelProps: raLabelProps,
  } = useLabel({ ...props });

  const isLimitReached = !!maxSize && (value || fieldValues).length >= maxSize;
  const isDisabled = (value || fieldValues).length === 1;

  const renderedItem = useCallback(
    (id, fieldValue, otherFieldProps, onComponentRender) => {
      if (onComponentRender) {
        return onComponentRender(
          id,
          fieldValue,
          onFieldValueChange,
          onFieldDelete,
          isDisabled,
          otherFieldProps,
        );
      }
      return renderField(
        id,
        fieldValue,
        onFieldValueChange,
        onFieldDelete,
        isDisabled,
        otherFieldProps,
      );
    }, [onFieldValueChange, onFieldDelete, renderField, isDisabled]);

  const { ariaProps, nonAriaProps } = getAriaAttributeProps(others);

  return (
    <Box {...nonAriaProps}>
      <Label {...raLabelProps} {...mergeProps(labelProps, raLabelProps, { children: label })} />
      <Box as="ul" pl="0" {...ariaProps}>
        {(value || fieldValues).map(
          ({ id, onComponentRender, fieldValue, ...otherFieldProps }) => {
            return (
              <Box as="li" mb="xs" key={id}>
                {renderedItem(id, fieldValue, otherFieldProps, onComponentRender)}
              </Box>
            );
          })}
      </Box>
      {
        helperText
        && (
        <FieldHelperText status={status}>
          {helperText}
        </FieldHelperText>
        )
      }
      {
        isLimitReached
        && (
        <FieldHelperText status={statuses.DEFAULT}>
          {maxSizeText || `Maximum ${maxSize} items.`}
        </FieldHelperText>
        )
      }
      {!isLimitReached
        && (
        <Button
          aria-label="Add field"
          variant="link"
          onPress={onFieldAdd}
          sx={{ width: 'fit-content', mt: 'xs' }}
        >
          <Text variant="label" color="active">
            {addButtonLabel}
          </Text>
        </Button>
        )}
    </Box>
  );
};

ArrayField.propTypes = {
  /** Label for add button */
  addButtonLabel: PropTypes.string,
  /** The default value for the array input field (uncontrolled). */
  defaultValue: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  /** The default value of the array input field (controlled). */
  value: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  /** The rendered label for the field. */
  label: PropTypes.node,
  /** Props object that is spread directly into the label element. */
  labelProps: PropTypes.shape({}),
  /** Text to display before add button. Useful for errors or other info. */
  helperText: PropTypes.node,
  /** Callback for changing array field data  */
  onChange: PropTypes.func,
  /** Callback for adding new empty field */
  onAdd: PropTypes.func,
  /** Callback for deleting a field */
  onDelete: PropTypes.func,
  /** Render prop to display an input field */
  renderField: PropTypes.func,
  /** Determines the maximum number of items */
  maxSize: isValidPositiveInt,
  /** Text to display when the maximum number of items is reached */
  maxSizeText: PropTypes.node,
  ...statusPropTypes,
  ...ariaAttributesBasePropTypes,
};

ArrayField.defaultProps = {
  addButtonLabel: '+ Add',
};

export default ArrayField;
