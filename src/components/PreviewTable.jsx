import React from 'react';

const PreviewTable = ({ preview, onCommit, onRollback, loading }) => {
  if (!preview) return null;

  const { columns, rows, totalRows } = preview;

  return (
    <div className="card mb-4">

      {/* Header */}
      <div className="card-header text-white d-flex
                      align-items-center justify-content-between"
           style={{ background: 'linear-gradient(135deg,#27ae60,#2ecc71)' }}>
        <span>
          <i className="bi bi-eye me-2"></i>Step 3 — Data Preview
        </span>
        <span className="badge bg-white text-dark px-3 py-2">
          Showing <strong>{rows.length}</strong> of{' '}
          <strong>{totalRows}</strong> rows
        </span>
      </div>

      <div className="card-body">

        {/* Legend */}
        <div className="d-flex flex-wrap gap-2 mb-3">
          <span className="badge-null">
            <i className="bi bi-dash-circle me-1"></i>
            null = inserted as NULL
          </span>
          <span className="badge-auto">
            <i className="bi bi-gear me-1"></i>
            (auto) = DB auto-generated
          </span>
        </div>

        {/* Preview table */}
        <div className="table-scroll">
          <table className="table table-bordered table-hover table-sm mb-0">
            <thead>
              <tr>
                <th width="50">#</th>
                {columns.map(col => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td className="text-muted">{i + 1}</td>
                  {columns.map(col => (
                    <td key={col}>
                      {row[col] === '(auto)'
                        ? <span className="auto-val">
                            <i className="bi bi-gear-fill me-1"
                               style={{ fontSize: 10 }}></i>auto
                          </span>
                        : row[col] === null || row[col] === undefined
                          ? <span className="null-val">
                              <i className="bi bi-dash me-1"></i>null
                            </span>
                          : row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* More rows note */}
        {totalRows > 10 && (
          <p className="text-muted mt-2 mb-0" style={{ fontSize: 12 }}>
            <i className="bi bi-three-dots me-1"></i>
            and <strong>{totalRows - 10}</strong> more rows not shown in preview.
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="card-footer">
        <div className="d-flex gap-3 align-items-center flex-wrap">

          {/* Commit */}
          <button
            className="btn btn-success px-4"
            onClick={onCommit}
            disabled={loading}>
            {loading
              ? <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Inserting...
                </>
              : <>
                  <i className="bi bi-database-fill-up me-2"></i>
                  Insert All {totalRows} Rows
                </>}
          </button>

          {/* Rollback */}
          <button
            className="btn btn-outline-danger px-4"
            onClick={onRollback}
            disabled={loading}>
            <i className="bi bi-arrow-counterclockwise me-2"></i>
            Rollback
          </button>

          {/* Safety note */}
          <span className="text-muted small ms-auto">
            <i className="bi bi-shield-check text-success me-1"></i>
            All rows succeed or all rollback.
          </span>

        </div>
      </div>

    </div>
  );
};

export default PreviewTable;
