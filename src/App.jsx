import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DataView from './pages/DataView';
import Upload from './pages/Upload';

function App() {
  const columnConfigs = {
    resume: ['name', 'email', 'phone', 'location', 'skills', 'education', 'experience', 'projects'],
    invoice: ['invoice_number', 'invoice_date', 'vendor_name', 'total_amount', 'tax', 'currency'],
    passport: ['full_name', 'passport_number', 'nationality', 'date_of_birth', 'expiry_date'],
    idproof: ['full_name', 'type_of_id', 'id_number', 'address', 'date_of_birth'],
    loan: ['applicant_name', 'loan_type', 'loan_amount', 'interest_rate', 'tenure'],
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<Upload />} />

          <Route
            path="resume"
            element={
              <DataView
                endpoint="/resume"
                title="Resumes"
                subtitle="Parsed resume data from applicants"
                columns={columnConfigs.resume}
              />
            }
          />

          <Route
            path="loan"
            element={
              <DataView
                endpoint="/loan"
                title="Loans"
                subtitle="Loan application documents"
                columns={columnConfigs.loan}
              />
            }
          />
          <Route
            path="invoice"
            element={
              <DataView
                endpoint="/invoice"
                title="Invoices"
                subtitle="Processed invoice data"
                columns={columnConfigs.invoice}
              />
            }
          />
          <Route
            path="passport"
            element={
              <DataView
                endpoint="/passport"
                title="Passports"
                subtitle="Passport identity extractions"
                columns={columnConfigs.passport}
              />
            }
          />
          <Route
            path="idproof"
            element={
              <DataView
                endpoint="/idproof"
                title="ID Proofs"
                subtitle="Identity verification documents"
                columns={columnConfigs.idproof}
              />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
