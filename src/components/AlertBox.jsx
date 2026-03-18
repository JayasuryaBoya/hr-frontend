import React, { useState } from 'react';

const Alert = ({ type, icon, children }) => {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className={`alert alert-${type} d-flex align-items-center
                     gap-2 shadow-sm rounded-3 mb-4`}>
      <i className={`bi ${icon} fs-5 flex-shrink-0`}></i>
      <span>{children}</span>
      <button type="button" className="btn-close ms-auto"
              onClick={() => setShow(false)} />
    </div>
  );
};

const AlertBox = ({ message, error, warnings = [] }) => {
  return (
    <>
      {message && (
        <Alert type="success" icon="bi-check-circle-fill">
          {message}
        </Alert>
      )}
      {error && (
        <Alert type="danger" icon="bi-exclamation-triangle-fill">
          {error}
        </Alert>
      )}
      {warnings.length > 0 && (
        <Alert type="warning" icon="bi-exclamation-circle-fill">
          <div>
            <strong>Warnings ({warnings.length})</strong>
            <ul className="mb-0 ps-3 mt-1" style={{ fontSize: 13 }}>
              {warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        </Alert>
      )}
    </>
  );
};

export default AlertBox;
