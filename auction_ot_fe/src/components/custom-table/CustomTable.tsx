import React, { ReactNode } from 'react';
import { Empty, Spin } from 'antd';
import CustomPagination from './CustomPagination';

interface PaginationProps {
  pageSize: number;
  current: number;
  total: number;
  onChange: (page: number) => void;
}

interface Column {
  title: string | (() => ReactNode);
  dataIndex: string;
  key: string;
  align?: 'left' | 'right' | 'center';
  width?: string | number;
  render?: (_: any, record: Record<string, any>) => ReactNode;
}

interface CustomTableProps {
  columns: Column[];
  dataSource: Record<string, any>[];
  pagination?: PaginationProps;
  loading?: boolean;
  emptyText?: ReactNode;
  header?: string | ReactNode;
  filterComponent?: ReactNode;
}

const CustomTable: React.FC<CustomTableProps> = ({
  columns,
  dataSource,
  pagination,
  loading = false,
  emptyText = "Không có dữ liệu",
  header = "",
  filterComponent,
}) => {
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 0;

  return (
    <div className="dashboard-section">
      <div className="container">
        <div className="dashboard-wrapper">
          <div className="dashboard-content-wrap">
            {filterComponent}
            <div className="bidding-summary-wrap">
              <h6>{header}</h6>
              <div style={{ overflowX: "auto", width: "100%" }}>
                <table className="bidding-summary-table">
                  <thead style={{ backgroundColor: "#1D586D" }}>
                    <tr>
                      {columns.map((col, index) => (
                        <th
                          key={index}
                          style={{ width: col.width, textAlign: col.align }}
                        >
                          {typeof col.title === "function"
                            ? col.title()
                            : col.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={columns.length}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              height: "100px",
                            }}
                          >
                            <Spin tip="Loading..." />
                          </div>
                        </td>
                      </tr>
                    ) : dataSource && dataSource.length > 0 ? (
                      dataSource.map((data, rowIndex) => (
                        <tr key={rowIndex}>
                          {columns.map((col, colIndex) => (
                            <td
                              style={{ width: col.width, textAlign: col.align }}
                              key={colIndex}
                              data-label={
                                typeof col.title === "string" ? col.title : ""
                              }
                            >
                              {col.render
                                ? col.render(null, data)
                                : data[col.dataIndex]}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          style={{ textAlign: "center" }}
                          colSpan={columns.length}
                        >
                          {emptyText || (
                            <Empty
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                              description="Không có dữ liệu"
                            />
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {pagination && totalPages > 1 && (
              <CustomPagination
                current={pagination.current}
                total={pagination.total}
                pageSize={pagination.pageSize}
                onChange={pagination.onChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomTable;
