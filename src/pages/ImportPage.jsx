import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getTables, getColumns, uploadFile,
  commitImport, rollbackImport, clearUploads,
} from '../api';

import Navbar        from '../components/Navbar';
import AlertBox      from '../components/AlertBox';
import StepIndicator from '../components/StepIndicator';
import ColumnPanel   from '../components/ColumnPanel';
import MappingTable  from '../components/MappingTable';
import PreviewTable  from '../components/PreviewTable';


const ImportPage = () => {
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────
  const [admin,     setAdmin]   = useState(null);
  const [tables,    setTables]  = useState([]);
  const [tableName, setTable]   = useState('');
  const [columns,   setCols]    = useState([]);
  const [colLoad,   setColLoad] = useState(false);
  const [file,      setFile]    = useState(null);
  const [mapping,   setMapping] = useState(null);
  const [preview,   setPreview] = useState(null);
  const [message,   setMsg]     = useState('');
  const [error,     setErr]     = useState('');
  const [warnings,  setWarns]   = useState([]);
  const [loading,   setLoad]    = useState(false);

  // Current step based on state
  const step = preview ? 3 : mapping ? 2 : 1;

  // ── Clear all alerts ───────────────────────────────────
  const clearAlerts = () => {
    setMsg('');
    setErr('');
    setWarns([]);
  };

  // ── Handle 401 — redirect to login ────────────────────
  const handle401 = useCallback((err) => {
    if (err.response?.status === 401) {
      navigate('/login');
    } else {
      setErr(err.response?.data?.error || err.message);
    }
  }, [navigate]);

  // ── Load tables on mount ───────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await getTables();
        setTables(res.data.tables || []);
        setAdmin(res.data.admin   || null);
      } catch (err) {
        if (err.response?.status === 401) {
          sessionStorage.removeItem('isLoggedIn');
          navigate('/login', { replace: true });
        } else {
          setErr(err.response?.data?.error || err.message);
        }
      }
    })();
  }, [navigate]); // ✅ FIXED: was [], now [navigate]

  // ── Table select → load columns ────────────────────────
  const handleTableChange = async (name) => {
    setTable(name);
    setCols([]);
    setMapping(null);
    setPreview(null);
    clearAlerts();
    if (!name) return;

    setColLoad(true);
    try {
      const res = await getColumns(name);
      setCols(res.data.columns || []);
    } catch (err) {
      handle401(err);
    } finally {
      setColLoad(false);
    }
  };

  // ── Upload & auto-map ──────────────────────────────────
  const handleUpload = async (e) => {
    e.preventDefault();
    clearAlerts();

    if (!tableName) { setErr('❌ Please select a table first.'); return; }
    if (!file)      { setErr('❌ Please choose an Excel file.'); return; }

    setLoad(true);
    try {
      const res = await uploadFile(tableName, file);
      const d   = res.data;
      setMsg(d.message    || '');
      setWarns(d.warnings || []);
      setMapping(d.mapping || null);
      setPreview(d.preview || null);
    } catch (err) {
      if (err.response?.data?.mapping) {
        setMapping(err.response.data.mapping);
      }
      handle401(err);
    } finally {
      setLoad(false);
    }
  };

  // ── Commit ─────────────────────────────────────────────
  const handleCommit = async () => {
    if (!window.confirm(
      `Insert all ${preview?.totalRows} rows into database?`
    )) return;

    clearAlerts();
    setLoad(true);
    try {
      const res = await commitImport();
      setMsg(res.data.message || '✅ Import complete.');
      setMapping(null);
      setPreview(null);
      setFile(null);
    } catch (err) {
      handle401(err);
    } finally {
      setLoad(false);
    }
  };

  // ── Rollback ───────────────────────────────────────────
  const handleRollback = async () => {
    if (!window.confirm(
      'Discard this import? No data will be inserted.'
    )) return;

    clearAlerts();
    try {
      const res = await rollbackImport();
      setMsg(res.data.message || '🔄 Cancelled.');
      setMapping(null);
      setPreview(null);
      setFile(null);
    } catch (err) {
      handle401(err);
    }
  };

  // ── Clear uploads ──────────────────────────────────────
  const handleClear = async () => {
    if (!window.confirm('Delete all files in uploads folder?')) return;
    clearAlerts();
    try {
      const res = await clearUploads();
      setMsg(res.data.message || '🗑️ Cleared.');
    } catch (err) {
      handle401(err);
    }
  };

  // ── Render ─────────────────────────────────────────────
  return (
    <>
      <Navbar username={admin?.username} />

      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h2>
            <i className="bi bi-database-up me-2"></i>
            Data Import Dashboard
          </h2>
          <p>Upload Excel files and map fields to database tables</p>
        </div>
      </div>

      <div className="container pb-5" style={{ marginTop: 48 }}>

        {/* Alerts */}
        <AlertBox
          message={message}
          error={error}
          warnings={warnings}
        />

        {/* Step Indicator */}
        <StepIndicator step={step} />

        {/* ── UPLOAD CARD ────────────────────────────────── */}
        <div className="card mb-4">
          <div className="card-header text-white"
               style={{ background: 'linear-gradient(135deg,#1e3a5f,#2980b9)' }}>
            <i className="bi bi-upload me-2"></i>
            Step 1 — Select Table & Upload Excel
          </div>

          <div className="card-body">
            <form onSubmit={handleUpload}>
              <div className="row g-4 align-items-end">

                {/* Table Select */}
                <div className="col-lg-4 col-md-5">
                  <label className="form-label">
                    <i className="bi bi-table me-1"></i>Target Table
                  </label>
                  <select
                    className="form-select"
                    required
                    value={tableName}
                    onChange={e => handleTableChange(e.target.value)}>
                    <option value="">— Select a Table —</option>
                    {tables.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* File Upload */}
                <div className="col-lg-5 col-md-5">
                  <label className="form-label">
                    <i className="bi bi-file-earmark-excel me-1 text-success"></i>
                    Excel File
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".xlsx,.xls"
                    required
                    onChange={e => setFile(e.target.files[0])}
                  />
                  <div className="form-text">
                    Max 10MB &nbsp;·&nbsp; .xlsx or .xls only
                  </div>
                </div>

                {/* Submit */}
                <div className="col-lg-3 col-md-2">
                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}>
                    {loading
                      ? <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Processing...
                        </>
                      : <>
                          <i className="bi bi-magic me-2"></i>
                          Upload & Map
                        </>}
                  </button>
                </div>

              </div>
            </form>

            {/* Column Panel — appears after table select */}
            <ColumnPanel
              tableName={tableName}
              columns={columns}
              loading={colLoad}
            />
          </div>

          {/* Clear uploads */}
          <div className="card-footer d-flex justify-content-end">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={handleClear}>
              <i className="bi bi-trash3 me-1"></i>Clear All Uploads
            </button>
          </div>
        </div>

        {/* ── FIELD MAPPING ──────────────────────────────── */}
        {mapping && (
          <>
            <hr className="section-divider" />
            <MappingTable mapping={mapping} />
          </>
        )}

        {/* ── DATA PREVIEW ───────────────────────────────── */}
        {preview && (
          <>
            <hr className="section-divider" />
            <PreviewTable
              preview={preview}
              onCommit={handleCommit}
              onRollback={handleRollback}
              loading={loading}
            />
          </>
        )}

      </div>

      {/* Footer */}
      <footer className="app-footer">
        <i className="bi bi-heart-fill text-danger me-1"></i>
        Hyderabad Runners Import System &copy; {new Date().getFullYear()}
      </footer>
    </>
  );
};

export default ImportPage;
