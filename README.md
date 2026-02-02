# AI Document Parser (Nexus)

A sophisticated, cloud-native document automation platform designed to streamline the extraction and analysis of business-critical documents. This project demonstrates a production-ready integration of modern frontend technologies with AWS cloud services.

## 🚀 Overview
The **AI Document Parser** provides a seamless, secure, and intelligent environment for managing various document types. It leverages AWS's robust infrastructure to handle everything from secure user authentication to high-speed document processing and structured data visualization.

---

## 🛠 Tech Stack
| Tier | Technologies |
| :--- | :--- |
| **Frontend** | React 19 (Vite), Tailwind CSS 4, Lucide React, Axios |
| **Authentication** | AWS Cognito (OAuth 2.0 with PKCE Flow) |
| **Storage** | AWS S3 (Direct Uploads via Pre-signed URLs) |
| **Backend API** | AWS API Gateway (RESTful), AWS Lambda |
| **Analysis** | AI-driven extraction (Resumes, Invoices, Loans, Passports, ID Proofs) |

---

## ✨ Key Features

### 🔐 Enterprise-Grade Security
- **OAuth 2.0 with PKCE**: Implements the most secure flow for Public Clients (SPAs), ensuring tokens are exchanged securely without exposing secrets.
- **JWT Authorization**: All API requests are protected by Cognito-issued Access and ID tokens.

### 📤 Optimized File Handling
- **Pre-signed URLs**: Uploads bypass application servers, sending files directly to AWS S3 using short-lived signed URLs. This ensures scalability and reduces latency.
- **Progress Tracking**: Real-time upload progress bars and status indicators for a smooth user experience.

### 📊 Intelligent Command Center
- **Categorized Dashboards**: Dedicated views for Resumes, Invoices, Loans, and Identity Documents.
- **Rich UI/UX**: A modern "Glassmorphism" design system built with Tailwind CSS, featuring smooth transitions and responsive layouts.
- **Search & Filter**: Structured data tables with search capabilities to quickly locate extracted information.

---

## 🏗 Architecture & Workflow

1.  **Authentication**: Users login via the Cognito Hosted UI. The application captures the authorization code and exchanges it for JWT tokens using a generated `code_verifier`.
2.  **Upload Flow**:
    - Frontend requests a pre-signed `PUT` URL from API Gateway.
    - API Gateway (guarded by a JWT Authorizer) generates the URL via a Lambda function.
    - Frontend performs a direct upload to S3, including the necessary metadata.
3.  **Data Ingestion**: Once uploaded, the back-end (Lambda/Textract/Rekognition) processes the document and stores structured data.
4.  **Data Rendering**: The React frontend fetches this structured data via authenticated GET requests, rendering it in dynamic, searchable tables.

## 🏗 Complete Project Architecture Diagram

```mermaid
    graph TD
    %% User and Frontend
    User((User)) -->|HTTPS| CF[AWS CloudFront]
    CF -->|Serves Static Files| S3_Static[AWS S3: Web Hosting]
    
    %% Authentication Flow
    User -->|Login| Cognito[AWS Cognito: User Pool]
    Cognito -->|JWT Tokens| User
    
    %% API Interactions
    User -->|Auth Header + Request| APIGW[AWS API Gateway]
    
    subgraph "Backend Services (Serverless)"
        APIGW -->|Trigger| Lambda_Presigned[Lambda: Pre-signed URL Gen]
        APIGW -->|Trigger| Lambda_Data[Lambda: Data Fetching]
        
        Lambda_Presigned -->|Returns URL| APIGW
        Lambda_Data -->|Query| DDB[(Amazon DynamoDB)]
    end
    
    %% Document Processing Flow
    User -->|PUT Object| S3_Docs[AWS S3: Document Storage]
    S3_Docs -->|Event Trigger| Lambda_Processor[Lambda: Document Processor]
    
    subgraph "AI Extraction Tier"
        Lambda_Processor -->|Extract Text| Textract[AWS Textract / Rekognition]
        Textract -->|Structured Result| Lambda_Processor
        Lambda_Processor -->|Store Data| DDB
    end

    %% CI/CD Flow
    GitHub[GitHub Repo] -->|Push| GHA[GitHub Actions]
    GHA -->|Build & Deploy| S3_Static
    GHA -->|Invalidate Cache| CF
```
---

## 👔 Recruiter's Corner: Engineering Excellence

This project showcases several advanced engineering concepts:

- **Cloud Integration**: Not just using a backend, but directly interacting with multi-service AWS architectures.
- **Security First**: Deep understanding of OAuth2 standards and secure token management in the browser.
- **Aesthetic Engineering**: Focus on visual excellence and performance, ensuring the app looks and feels premium while remaining highly functional.
- **Code Scalability**: Modular React components, centralized API clients with request interceptors, and a clean separation of concerns.

---

## ⚙️ Local Development

1.  **Clone & Install**:
    ```bash
    git clone https://github.com/your-username/aws-data-dashboard.git
    cd aws-data-dashboard
    npm install
    ```
2.  **Run**:
    ```bash
    npm run dev
    ```

---

**Developed by Rishi Majmudar**  
*Cloud Integrations | Frontend Architecture | AI Solutions*
