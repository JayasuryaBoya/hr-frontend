import React from 'react';

const MappingTable = ({ mapping }) => {
  if (!mapping) return null;

  const {
    matched        = {},
    unmapped       = [],
    missing        = [],
    criticalMissing = [],
    tableName,
    allDbColumns   = [],
  } = mapping;

  const matchedCount  = Object.keys(matched).length;
  const autoCount     = missing.filter(m => m.isAuto).length;
  const criticalCount = criticalMissing.length;

  let rowNum = 1;

  return (
    <>
      {/* ── Stat Cards ───────────────────────────────────── */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="stat-card green">
            <div className="stat-num text-success">{matchedCount}</div>
            <div className="stat-label">Matched</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card orange">
            <div className="stat-num text-warning">{unmapped.length}</div>
            <div className="stat-label">Skipped</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card blue">
            <div className="stat-num text-primary">{autoCount}</div>
            <div className="stat-label">Auto (DB Default)</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card red">
            <div className="stat-num text-danger">{criticalCount}</div>
            <div className="stat-label">Critical Missing</div>
          </div>
        </div>
      </div>

      {/* ── Mapping Table ─────────────────────────────────── */}
      <div className="card mb-4">
        <div className="card-header bg-dark text-white d-flex
                        align-items-center justify-content-between">
          <span>
            <i className="bi bi-diagram-3 me-2"></i>
            Step 2 — Field Mapping Result
          </span>
          <code className="text-warning fs-6">{tableName}</code>
        </div>

        <div className="card-body p-0">
          <div className="table-scroll">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th width="50">#</th>
                  <th>Excel Column</th>
                  <th width="50" className="text-center">→</th>
                  <th>DB Column</th>
                  <th>Data Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>

                {/* Matched rows */}
                {Object.entries(matched).map(([excel, db]) => {
                  const col = allDbColumns.find(c => c.column_name === db);
                  return (
                    <tr key={`m-${excel}`}>
                      <td className="text-muted fw-light">{rowNum++}</td>
                      <td><strong>{excel}</strong></td>
                      <td className="text-center text-muted">→</td>
                      <td><strong>{db}</strong></td>
                      <td>
                        <span className="badge-type">
                          {col?.data_type || ''}
                        </span>
                      </td>
                      <td>
                        <span className="badge-matched">
                          <span className="dot dot-green"></span>Matched
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {/* Skipped (unmapped Excel columns) */}
                {unmapped.map(col => (
                  <tr key={`u-${col}`} style={{ background: '#fffdf0' }}>
                    <td className="text-muted fw-light">{rowNum++}</td>
                    <td><strong>{col}</strong></td>
                    <td className="text-center text-muted">→</td>
                    <td className="text-muted">—</td>
                    <td>—</td>
                    <td>
                      <span className="badge-skipped">
                        <span className="dot dot-orange"></span>Skipped
                      </span>
                    </td>
                  </tr>
                ))}

                {/* Missing DB columns */}
                {missing.map(col => (
                  <tr key={`miss-${col.column}`}
                      style={{ background: col.is_nullable === 'NO' && !col.isAuto ? '#fff5f5' : '' }}>
                    <td className="text-muted fw-light">{rowNum++}</td>
                    <td className="text-muted">—</td>
                    <td className="text-center text-muted">→</td>
                    <td><strong>{col.column}</strong></td>
                    <td>
                      <span className="badge-type">{col.data_type}</span>
                    </td>
                    <td>
                      {col.isAuto
                        ? <span className="badge-auto">
                            <span className="dot dot-blue"></span>Auto
                          </span>
                        : col.is_nullable === 'NO'
                          ? <span className="badge-required">
                              <span className="dot dot-red"></span>❌ Required Missing
                            </span>
                          : <span className="badge-null">
                              <span className="dot dot-orange"></span>Will be NULL
                            </span>}
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Critical Block Alert ──────────────────────────── */}
      {criticalMissing.length > 0 && (
        <div className="alert alert-danger d-flex
                        align-items-start gap-3 rounded-3">
          <i className="bi bi-x-octagon-fill fs-4 flex-shrink-0 mt-1"></i>
          <div>
            <strong>
              Cannot Proceed — Required columns missing in Excel:
            </strong>
            <div className="mt-1">
              {criticalMissing.map(c => (
                <span key={c.column} className="badge bg-danger me-1">
                  {c.column}
                </span>
              ))}
            </div>
            <div className="mt-2 text-muted small">
              Add these columns to your Excel file and re-upload.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MappingTable;
