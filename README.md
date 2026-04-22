# Diplomat: The Intelligent Invoice Assistant

**Diplomat** is a high-performance web application designed to automate the awkward process of chasing unpaid invoices with professional precision. It transforms a high-anxiety task into a silent, automated back-office operation.

### 🌟 Key Features

- **Diplomatic Scaling**: A 4-level automated communication sequence (Standard → Gentle → Formal → Urgent) that progressively adjusts tone based on invoice age.
- **Local-First Architecture**: Built using **Dexie.js**, data is stored directly in the user's browser (IndexedDB) for zero-latency interactions and maximum privacy.
- **Bulk CSV Import**: Smart mapping logic allows for importing existing debtor lists from CSV exports (QuickBooks, Excel, etc.) in seconds.
- **Premium Intelligence UI**: A dark-mode Dashboard with glassmorphism aesthetics and smooth transitions, built for a "Command Center" experience.

### 🛠️ Tech Stack

- **Frontend**: React 18 + Vite (for ultra-fast development and build times).
- **Styling**: Vanilla CSS with modern Flexbox/Grid and custom design tokens.
- **Animations**: Framer Motion for premium micro-interactions.
- **Database**: Dexie.js (IndexedDB wrapper) for persistent browser storage.
- **Icons**: Lucide React for consistent, professional iconography.

### 🚀 Quick Start

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/diplomat.git
    cd diplomat
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```

4.  **Open in Browser**:
    Navigate to `http://localhost:5173` to see your dashboard in action.

---

### 📈 Future Enhancements

- **Direct API Integrations**: One-click connection to WhatsApp and SendGrid for real-time automated messaging.
- **Accounting Sync**: Native connectors for QuickBooks, Wave, and Xero.
- **LLM Tone Calibration**: Dynamic AI-generated message templates based on specific customer relationship history.

---

*This project was developed as a case study in high-impact, simple-infrastructure SaaS tools for small businesses.*
