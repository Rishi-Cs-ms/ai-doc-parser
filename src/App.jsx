import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DataView from './pages/DataView';
import Upload from './pages/Upload';
import { storeTokens } from './api/auth';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for tokens in the URL hash (Implicit Flow)
    console.log("Checking hash for tokens:", window.location.hash);
    if (window.location.hash) {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const idToken = params.get('id_token');
      const accessToken = params.get('access_token');

      console.log("Parsed Tokens:", { idToken: !!idToken, accessToken: !!accessToken });

      if (idToken && accessToken) {
        console.log("Storing tokens...");
        storeTokens(idToken, accessToken);
        // Clear the hash from the URL so the user doesn't see the ugly tokens
        window.history.replaceState({}, document.title, window.location.pathname);
        console.log("Tokens stored and hash cleared.");
        // Force update auth state in other components if they are listening to storage (they aren't reactive by default)
        // A reload is a brute force way to ensure everything updates:
        window.location.reload();
      }
    }
  }, [location]);

  const columnConfigs = {
    resume: ['name', 'email', 'phone', 'location', 'skills', 'education', 'experience', 'projects'],
    invoice: ['invoice_number', 'invoice_date', 'vendor_name', 'total_amount', 'tax', 'currency'],
    passport: ['full_name', 'passport_number', 'nationality', 'date_of_birth', 'expiry_date'],
    idproof: ['full_name', 'type_of_id', 'id_number', 'address', 'date_of_birth'],
    loan: ['applicant_name', 'loan_type', 'loan_amount', 'interest_rate', 'tenure'],
  };

  return (
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
  );
}

export default App;
