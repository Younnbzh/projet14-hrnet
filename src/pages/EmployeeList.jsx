import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import '../assets/css/pages/EmployeeList.css';
/**
 * EmployeeList Component
 * This component displays a list of employees in a table format uses TanStack React Table 
 */
const EmployeeList = () => {
  // State to store the complete list of employees loaded from localStorage
  const [employees, setEmployees] = useState([]);
  // State to manage the global search filter that searches across all columns
  const [globalFilter, setGlobalFilter] = useState('');
  // Load employees from localStorage
  useEffect(() => {
    const savedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    setEmployees(savedEmployees);
  }, []);
  // Define table columns configuration with useMemo to prevent rerender of TanStack with accessorKey = name in data object
  const columns = useMemo(
    () => [
      {
        accessorKey: 'firstName',
        header: 'First Name',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'startDate',
        header: 'Start Date',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'department',
        header: 'Department',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'dateOfBirth',
        header: 'Date of Birth',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'street',
        header: 'Street',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'city',
        header: 'City',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'state',
        header: 'State',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'zipCode',
        header: 'Zip Code',
        cell: (info) => info.getValue(),
      },
    ],
    []
  );
  // Create the table instance using TanStack React Table with current state of filters, sorting, pagination
  const table = useReactTable({
    data: employees,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter, // function to update global filter
    getCoreRowModel: getCoreRowModel(), // Tanstack row model for basic table functionality
    getFilteredRowModel: getFilteredRowModel(), // Tanstack row model for filtering functionality
    getSortedRowModel: getSortedRowModel(), // Tanstack row model for sorting functionality
    getPaginationRowModel: getPaginationRowModel(), // Tanstack row model for pagination functionality
    initialState: {
      pagination: {
        pageSize: 10, // Initial page size for pagination 10 entries per page
      },
    },
  });

  return (
    <div className="employee-list">
      <div className="container">
        <h1>Current Employees</h1>

        <div className="table-controls">
          {/* Global search input */}
          <div className="search-container">
            <label htmlFor="search">Search:</label>
            <input type="text" id="search" value={globalFilter ?? ''} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search employees..." className="search-input" />
          </div>
          {/* Display current results count */}
          <div className="results-info">
            Showing {table.getFilteredRowModel().rows.length} of {employees.length} entries
          </div>
        </div>
        {/* Main table container */}
        <div className="table-container">
          <table className="employee-table">
            {/* Table header with sortable columns */}
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()} // Click handler for sorting
                      className={header.column.getCanSort() ? 'sortable' : ''}
                    >
                      {/* Render header content de TanStack */}
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      {/* Display sort indicator arrows */}
                      {{
                        asc: ' ↑',
                        desc: ' ↓',
                      }[header.column.getIsSorted()] ?? ' ↕️'}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {/* Table body with employee data */}
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                // Render each row of employee data
                table.getRowModel().rows.map(row => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      // Render cell content using flexRender of TanStack 
                      <td key={cell.id}>
                      {
                        flexRender(
                          cell.column.columnDef.cell,
                        cell.getContext()
                        )}
                  </td>
                ))}
            </tr>
            ))
            ) : (
            // Display message when no employees are found
            <tr>
              <td colSpan={columns.length} className="no-data">
                No employees found
              </td>
            </tr>
              )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls section */}
      <div className="pagination-container">
        <div className="pagination-info">
          {/* Current page display */}
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
          {/* Jump to specific page input */}
          <span>
            | Go to page:{' '}
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={e => {
                // Convert 0 1 2 3 TanStack to 1 2 3 4 for user
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="page-input"
            />
          </span>
        </div>
        {/* Navigation buttons */}
        <div className="pagination-controls">
          <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="pagination-btn">
            {'<<'}
          </button>
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="pagination-btn">
            {'<'}
          </button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="pagination-btn">
            {'>'}
          </button>
          <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="pagination-btn">
            {'>>'}
          </button>
        </div>
        {/* Page size selector dropdown */}
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value));
          }}
          className="page-size-select"
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      {/* Navigation link back to home page */}
      <Link to="/" className="home-link">
        Home
      </Link>
    </div>
    </div >
  );
};

export default EmployeeList;