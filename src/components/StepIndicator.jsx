import React from 'react';

const StepIndicator = ({ step }) => {
  const steps = [
    { num: 1, label: 'Upload File' },
    { num: 2, label: 'Field Mapping' },
    { num: 3, label: 'Preview & Insert' },
  ];

  return (
    <div className="steps">
      {steps.map((s, i) => (
        <React.Fragment key={s.num}>
          <div className={`step ${step === s.num ? 'active' : ''} ${step > s.num ? 'done' : ''}`}>
            <div className="step-num">
              {step > s.num
                ? <i className="bi bi-check-lg" style={{ fontSize: 12 }}></i>
                : s.num}
            </div>
            <span style={{color:'white'}}>{s.label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`step-line ${step > s.num ? 'done' : ''}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
