import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';
import jsonData from './data.json';

const Table = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState('');

  const columns = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Full Name',
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
    },
    {
      header: 'Gender',
      accessorKey: 'gender',
    },
    {
      header: 'Date Of Birth',
      accessorKey: 'dob',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
  ];

  const table = useReactTable({
    data: jsonData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  // page number buttons
  const tableCountNumbers = (count) => {
    let array = [];
    for (let i = 0; i < count; i++) {
      array.push(i);
    }

    const visibleButtons = 4;
    const startIndex = Math.max(0, pageNumber - Math.floor(visibleButtons / 2));
    const endIndex = Math.min(startIndex + visibleButtons, count);

    const result = array.slice(startIndex, endIndex).map((item) => (
      <button
        key={item}
        className={`px-4 py-2 mx-1 font-semibold text-white ${
          pageNumber === item ? 'bg-purple-600' : 'bg-gray-400'
        } rounded`}
        onClick={() => {
          table.setPageIndex(item);
          setPageNumber(item);
        }}
      >
        {item + 1}
      </button>
    ));
    return result;
  };

  return (
    <div className='md:mx-20 mx-10 my-6'>
      {/* page title */}
      <p className='pb-2 font-bold text-2xl text-purple-600 text-center'>
        React Tanstack Table
      </p>

      {/* search bar */}
      <input
        className=' px-3 py-2 my-2 border rounded w-3/12 mx-auto block focus:outline-none focus:ring-1 focus:ring-purple-300'
        type='text'
        placeholder='Search...'
        onChange={(e) => table.setGlobalFilter(e.target.value)}
        value={filtering}
      />

      {/* table */}
      <table className='md:w-full border mt-4'>
        {/* table head */}
        <thead className='bg-gray-100'>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th
                  key={column.id}
                  className='px-6 py-3 text-left font-semibold md:text-lg text-md'
                  onClick={column.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    column.column.columnDef.header,
                    column.getContext()
                  )}

                  {/* sorting icons */}
                  {{ asc: '↑', desc: '↓' }[column.column.getIsSorted() ?? null]}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* table body */}
        <tbody className='bg-white divide-y divide-gray-200'>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className='hover:bg-gray-50 cursor-pointer'>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className='px-6 py-4'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* pagination buttons */}
      <section className='mt-6'>
        {/* page numbers */}
        <div className='mb-5'>
          <p className='text-center'>
            {tableCountNumbers(table.getPageCount())}
          </p>
        </div>
        <div className='flex justify-center items-center'>
          {/* first page button */}
          <button
            className={`px-4 py-2 mx-2 font-semibold text-white ${
              pageNumber < 1 ? 'bg-purple-300' : 'bg-purple-600'
            } rounded`}
            onClick={() => {
              table.setPageIndex(0);
              setPageNumber(0);
            }}
            disabled={pageNumber < 1}
          >
            First Page
          </button>

          {/* chevron left button */}
          <button
            className={`px-4 py-2 mx-3 font-semibold text-white ${
              !table.getCanPreviousPage() ? 'bg-gray-400' : 'bg-purple-600'
            } rounded`}
            onClick={() => {
              table.previousPage();
              setPageNumber(pageNumber - 1);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <i className='fa-solid fa-chevron-left'></i>
          </button>

          {/* chevron right button */}
          <button
            className={`px-4 py-2 mx-2 font-semibold text-white ${
              !table.getCanNextPage() ? 'bg-gray-400' : 'bg-purple-600'
            } rounded`}
            onClick={() => {
              table.nextPage();
              setPageNumber(pageNumber + 1);
            }}
            disabled={!table.getCanNextPage()}
          >
            <i className='fa-solid fa-chevron-right'></i>
          </button>

          {/* last page button */}
          <button
            className={`px-4 py-2 mx-2 font-semibold text-white ${
              pageNumber === table.getPageCount() - 1
                ? 'bg-purple-300'
                : 'bg-purple-600'
            } rounded`}
            onClick={() => {
              table.setPageIndex(table.getPageCount() - 1);
              setPageNumber(table.getPageCount() - 1);
            }}
          >
            Last Page
          </button>
        </div>
      </section>
    </div>
  );
};

export default Table;
