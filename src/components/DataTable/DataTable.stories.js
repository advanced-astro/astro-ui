import React from 'react';
import { useAsyncList } from 'react-stately';
import { faker } from '@faker-js/faker';
import ApplicationIcon from '@pingux/mdi-react/ApplicationIcon';
import { action } from '@storybook/addon-actions';
import isChromatic from 'chromatic/isChromatic';

import DocsLayout from '../../../.storybook/storybookDocsLayout';
import {
  DataTable,
  DataTableBadge,
  DataTableBody,
  DataTableCell,
  DataTableColumn,
  DataTableHeader,
  DataTableMenu,
  DataTableMultiLine,
  DataTableRow,
} from '../../index';
import { ariaAttributeBaseArgTypes } from '../../utils/docUtils/ariaAttributes';

import DataTableReadme from './DataTable.mdx';

export default {
  title: 'Components/DataTable',
  component: DataTable,
  parameters: {
    docs: {
      page: () => (
        <>
          <DataTableReadme />
          <DocsLayout />
        </>
      ),
      source: {
        type: 'code',
      },
    },
  },
  argTypes: {
    density: {
      control: {
        disable: true,
      },
      defaultValue: 'spacious',
    },
    overflowMode: {
      control: {
        disable: true,
      },
      defaultValue: 'truncate',
    },
    width: {
      description: 'Sets the width of the data table.',
      control: {
        disable: true,
      },
    },
    height: {
      description: 'Sets the height of the data table.',
      control: {
        disable: true,
      },
    },
    sortDescriptor: {
      description: 'Defines the current column key to sort by and the sort direction.',
      control: {
        disable: true,
      },
    },
    onSortChange: {
      description: 'Callback function that fires when sortable column header is pressed.',
    },
    allowsSorting: {
      description: 'Determine if the column supports sorting.',
      control: {
        disable: true,
      },
    },
    hideHeader: {
      description: 'Determine if the header should be hidden.',
      control: {
        disable: true,
      },
    },
    loadingState: {
      description: 'Reflects current loading state.',
      control: {
        disable: true,
      },
    },
    onLoadMore: {
      description: 'Callback function that fires when more data should be loaded on demand as user scrolls.',
    },
    items: {
      control: {
        disable: true,
      },
      description: 'The list of DataTable items.',
    },
    ...ariaAttributeBaseArgTypes,
  },
};

export const Default = args => {
  const columns = [
    { name: 'Country', key: 'country' },
    { name: 'Population', key: 'population' },
    { name: 'Continent', key: 'continent' },
  ];

  const rows = [
    {
      id: 1,
      country: 'USA',
      population: '320,000,000',
      continent: 'North America',
    },
    {
      id: 2,
      country: 'Canada',
      population: '37,000,000',
      continent: 'North America',
    },
    { id: 3, country: 'China', population: '1,398,000,000', continent: 'Asia' },
    { id: 4, country: 'France', population: '67,000,000', continent: 'Europe' },
  ];

  return (
    <DataTable {...args} aria-label="Static table" height="100%">
      <DataTableHeader columns={columns}>
        {column => (
          <DataTableColumn align="center">{column.name}</DataTableColumn>
        )}
      </DataTableHeader>
      <DataTableBody items={rows}>
        {item => (
          <DataTableRow>
            {columnKey => <DataTableCell>{item[columnKey]}</DataTableCell>}
          </DataTableRow>
        )}
      </DataTableBody>
    </DataTable>
  );
};

export const CustomContent = args => {
  /**
   * isChromatic checks if the code is running in Chromatic environment
   * @returns {Boolean}
   * Source: https://www.chromatic.com/docs/ischromatic
   * */
  const chromatic = isChromatic();

  const columns = [
    {
      name: 'Name/ID',
      key: 'name_id',
      isSortable: true,
    },
    {
      name: 'Status',
      key: 'status',
      isSortable: false,
    },
    {
      name: 'Category',
      key: 'category',
      isSortable: false,
    },
    {
      name: 'Date Submitted',
      key: 'date',
      isSortable: true,
    },
    {
      name: 'Submitted By',
      key: 'submitted_by',
      isSortable: true,
    },
    { name: 'Menu', key: 'menu', isSortable: false },
  ];

  const random = items => items[Math.floor(Math.random() * items.length)];

  const list = useAsyncList({
    async load({ signal, cursor }) {
      if (cursor) {
        // eslint-disable-next-line no-param-reassign
        cursor = cursor.replace(/^http:\/\//i, 'https://');
      }

      const res = await fetch(cursor || 'https://pokeapi.co/api/v2/pokemon', {
        signal,
      });

      const json = await res.json();
      await new Promise(resolve => setTimeout(resolve, cursor ? 2000 : 3000));

      const fakeData = [...Array(json.results.length).keys()].map(key => {
        return {
          id: key,
          date: chromatic ? '2022-12-25' : `${faker.date.past().toLocaleDateString('fr-CA')}`,
          category: chromatic ? 'Other' : `${random(['App Catalog', 'Delete Environment', 'Other'])}`,
          status: (
            <DataTableBadge
              cell={chromatic ? 'Pending' : `${random(['Pending', 'Rejected', 'Approved', 'Failed'])}`}
            />
          ),
          submitted_by: chromatic ? 'John Doe' : `${faker.name.firstName()} ${faker.name.lastName()}`,
          name_id: (
            <DataTableMultiLine
              cell={[
                {
                  name: chromatic ? 'ACME' : `${faker.company.name()}`,
                  icon: ApplicationIcon,
                  accountId: chromatic ? '123456789' : `${faker.finance.routingNumber()}`,
                },
              ]}
            />
          ),
          menu: <DataTableMenu />,
        };
      });
      const tableData = fakeData.map((item, i) => ({ ...item, ...json.results[i] }),
      );

      return {
        items: tableData,
        cursor: json.next,
      };
    },
    async sort({ items, sortDescriptor }) {
      let cmp;

      return {
        items: items.sort((a, b) => {
          const first = sortDescriptor.column !== 'name_id'
            ? a[sortDescriptor.column]
            : a[sortDescriptor.column].props.cell[0].name;
          const second = sortDescriptor.column !== 'name_id'
            ? b[sortDescriptor.column]
            : b[sortDescriptor.column].props.cell[0].name;

          if (sortDescriptor.column.includes('date')) {
            cmp = new Date(first) < new Date(second) ? -1 : 1;
          } else {
            cmp = (parseInt(first, 10) || first) < (parseInt(second, 10) || second)
              ? -1
              : 1;
          }
          if (sortDescriptor.direction === 'descending') {
            cmp *= -1;
          }
          return cmp;
        }),
      };
    },
  });

  return (
    <DataTable
      {...args}
      sortDescriptor={list.sortDescriptor}
      onSortChange={list.sort}
      aria-label="Custom content table"
      onAction={action('onAction')}
    >
      <DataTableHeader columns={columns}>
        {column => (
          <DataTableColumn
            width={
              // eslint-disable-next-line no-nested-ternary
              column.key === 'name_id'
                ? '26.5%'
                : column.key === 'menu'
                  ? '5%'
                  : '16%'
            }
            align={column.key !== 'menu' ? 'start' : 'center'}
            allowsSorting={column.isSortable}
            hideHeader={column.key === 'menu'}
          >
            {column.name}
          </DataTableColumn>
        )}
      </DataTableHeader>
      <DataTableBody
        items={list.items}
        loadingState={list.loadingState}
        onLoadMore={list.loadMore}
      >
        {item => (
          <DataTableRow key={item.name}>
            {columnKey => <DataTableCell>{item[columnKey]}</DataTableCell>}
          </DataTableRow>
        )}
      </DataTableBody>
    </DataTable>
  );
};
