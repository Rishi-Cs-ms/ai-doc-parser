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

```mermaid
graph TD
    %% Frontend & Auth
    User((User)) -->|HTTPS| CF[CloudFront]
    CF --> S3_Static[S3: Web Hosting]
    User -->|1. Login| Cognito[Cognito]
    Cognito -->|2. JWT Tokens| User
    
    %% API & Data Retrieval
    User -->|3. GET /data with JWT| APIGW[API Gateway]
    APIGW -->|Trigger| Lambda_Fetch[Lambda: Data Fetcher]
    
    subgraph "Efficient Data Tier"
        Lambda_Fetch -->|Query via GSI| DDB[(DynamoDB)]
        DDB -.- GSI[[GSI: username-index]]
    end

    %% The Processing Pipeline
    User -->|4. Authenticated Upload| S3_Docs[S3: Document Storage]
    S3_Docs -->|S3 Event Trigger| Lambda_AI[Lambda: AI Orchestrator]
    
    subgraph "The Sequential AI Handshake"
        Lambda_AI -->|1. Raw Extraction| Textract[AWS Textract]
        Textract -->|Extracted Text| Lambda_AI
        
        Lambda_AI -->|2. Intelligent Reasoning| Bedrock[Bedrock: Amazon Nova Lite]
        Bedrock -->|3. Structured JSON| Lambda_AI
    end
    
    Lambda_AI -->|4. Store Results| DDB
```

### ⚙️ The Engineering Workflow

1.  **Authentication**: Users login via Cognito (OAuth 2.0 with PKCE). Tokens are managed in the browser and passed to **all** API calls and upload requests for secure authorization.
2.  **Authenticated Upload Flow**:
    *   Once authenticated, the frontend requests a pre-signed URL from API Gateway (using the JWT for authorization).
    *   Files are sent to the **Document S3 Bucket** via a secure `PUT` request. **Direct anonymous uploads are prohibited; only authenticated users can initiate this process.**
3.  **The AI Handshake (Processing)**:
    *   An S3 Event triggers a Lambda function that orchestrates the extraction.
    *   **AWS Textract** handles the initial OCR and layout analysis of the document.
    *   The raw text is then passed to **Amazon Bedrock (Nova Lite)**, which uses LLM reasoning to extract contextually important fields (Skills, Amounts, Dates) into a clean, structured JSON format.
4.  **Database Optimization (GSI)**:
    *   Extracted data is stored in DynamoDB.
    *   To ensure lightning-fast retrieval, we use a **Global Secondary Index (GSI)** on the `username` field. This allow the system to perform targeted queries rather than full table scans, ensuring performance even as the database grows.
5.  **Secure View & Delivery**:
    *   **AWS CloudFront** fronts both the web hosting bucket and the document storage bucket. After login, users can view their processed document artifacts through secure, CloudFront-delivered links.
    
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
