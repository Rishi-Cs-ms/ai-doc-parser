import React, { Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DataView from './pages/DataView';
import Upload from './pages/Upload';
import { exchangeCodeForTokens } from './api/auth';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');

    if (code) {
      console.log("Authorization code found:", code);
      const handleAuth = async () => {
        try {
          await exchangeCodeForTokens(code);
          console.log("Tokens exchanged successfully.");
          // Use navigate to clear the code and update the URL without a full reload
          // This ensures we stay within the React app context and don't hit 404s on the server
          navigate('/', { replace: true });

          // Optional: If we need to force a re-check of auth state in Layout, 
          // we can trigger a custom event or context update. 
          // Since Layout listens to location changes, this navigate should be sufficient.
        } catch (error) {
          console.error('Failed to exchange code:', error);
          // Optionally show error to user
        }
      };
      handleAuth();
    }
  }, [location]);

  const columnConfigs = {
    resume: ['username', 'name', 'email', 'phone', 'location', 'skills', 'education', 'experience', 'projects'],
    invoice: ['username', 'invoice_number', 'invoice_date', 'vendor_name', 'total_amount', 'tax', 'currency'],
    passport: ['username', 'full_name', 'passport_number', 'nationality', 'date_of_birth', 'expiry_date'],
    idproof: ['username', 'full_name', 'type_of_id', 'id_number', 'address', 'date_of_birth'],
    loan: ['username', 'applicant_name', 'loan_type', 'loan_amount', 'interest_rate', 'tenure'],
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
