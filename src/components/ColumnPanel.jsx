import React from 'react';

const ColumnPanel = ({ tableName, columns, loading }) => {

  // Nothing selected yet
  if (!tableName) return null;

  // Loading spinner
  if (loading) return (
    <div className="col-panel mt-3">
      <div className="d-flex align-items-center gap-2 text-primary">
        <div className="spinner-border spinner-border-sm"></div>
        <span>
          Loading columns for <strong>{tableName}</strong>...
        </span>
      </div>
    </div>
  );

  // No columns returned
  if (!columns.length) return null;

  const total    = columns.length;
  const required = columns.filter(c => c.is_nullable === 'NO' && !c.column_default).length;
  const withDef  = columns.filter(c => c.column_default).length;

  return (
    <div className="col-panel mt-3">

      {/* Header row */}
      <div className="d-flex align-items-center justify-content-between
                      mb-3 flex-wrap gap-2">
        <span className="fw-semibold text-dark">
          <i className="bi bi-layout-text-window-reverse text-primary me-2"></i>
          Columns in <code>{tableName}</code>
        </span>
        <div className="d-flex gap-2 flex-wrap">
          <span className="badge bg-secondary rounded-pill">
            {total} columns
          </span>
          <span className="badge bg-danger rounded-pill">
            {required} required
          </span>
          <span className="badge bg-primary rounded-pill">
            {withDef} with default
          </span>
        </div>
      </div>

      {/* Scrollable table */}
      <div className="col-table-wrap">
        <table className="table table-sm table-bordered mb-0">
          <thead>
            <tr>
              <th width="40">#</th>
              <th>Column Name</th>
              <th>Data Type</th>
              <th>Nullable</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            {columns.map((col, i) => (
              <tr key={col.column_name}>
                <td className="text-muted">{i + 1}</td>
                <td><strong>{col.column_name}</strong></td>
                <td>
                  <span className="badge-type">{col.data_type}</span>
                </td>
                <td>
                  {col.is_nullable === 'YES'
                    ? <span className="badge bg-success rounded-pill">YES</span>
                    : <span className="badge bg-danger  rounded-pill">NO</span>}
                </td>
                <td>
                  {col.column_default
                    ? <code style={{ fontSize: 11 }}>
                        {col.column_default.length > 28
                          ? col.column_default.substring(0, 28) + '…'
                          : col.column_default}
                      </code>
                    : <span className="text-muted">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ColumnPanel;
