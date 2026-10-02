# Maharashtra Mobile - ABHR Web Data Management Dashboard

A modern, responsive, and minimalist web-based data management dashboard inspired by the Google Sheet structure for **Maharashtra Mobile**.

Built with **React 19**, **TypeScript**, and **Tailwind CSS v4**.

---

## 🚀 Key Features

### 1. Interactive Entry Form & Table Row Addition
- **No.** auto-incremented sequentially or manually editable.
- **Subject** field with quick suggestions (e.g. `"love Bar sound"`, `"Display Combo + Glass"`, `"C-Type Charging Jack"`).
- **Amount Breakdown**:
  - **CC (Numeric entry)**: Customer Charge / Credit with soft green accent.
  - **PP (Numeric entry)**: Parts Price / Purchase cost with soft orange accent.
  - **Live Row Total (CC + PP)** preview calculated before submitting.
- **Baki**: Status/notes field with one-click presets (`Clear`, `Paid UPI`, `Cash Paid`, `Baki 200`, `Pending Delivery`).
- **Continuous Quick Entry**: Press `Enter` to add entries consecutively.

### 2. Live Sheet Calculations & Formulas (Rows 8 to 1004 Simulation)
- **CC Total**: Automatically computes `=SUM(C8:C1004)` across all rows.
- **PP Total**: Automatically computes `=SUM(D8:D1004)` across all rows.
- **Grand Total**: Live dynamic sum `=E4+F4` of CC Total and PP Total.
- Formula badges explicitly showcase Google Sheets formula equivalents.

### 3. Top Summary Cards (Visual Anchors)
- **ABHR** prominent section title with metrics counter.
- **CC Total** card in vibrant Amber/Orange.
- **PP Total** card in vibrant Orange.
- **Grand Total** anchor card in deep Crimson/Red.
- Additional metrics for active row count, pending Baki balance, and average per entry.

### 4. Data Persistence & Management
- **Local Storage Auto-Save**: Real-time saving with live timestamp status indicator.
- **Inline Editing & Detailed Modal Editing**: Double-click or click the edit icon to edit directly in the table or open the edit modal.
- **Export Options**:
  - **CSV Export**: Compatible with Google Sheets and Microsoft Excel (includes formula totals row).
  - **JSON Export**: Clean structured JSON file.
  - **Copy JSON**: One-click clipboard copy for direct GitHub repository commit or REST API synchronization with a Headless CMS (Strapi, Supabase, Directus, Firebase).
- **Import / Restore**: Import from CSV or JSON with Append or Replace modes.

### 5. Print & PDF Ledger View
- Clean printable sheet format (`Ctrl + P` or "Print" button) formatted as a professional paper billing/ledger sheet.

---

## 🛠️ Development & Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```

---

## 📂 Project Structure

```
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Top navigation, status indicator & actions
│   │   ├── SummaryCards.tsx        # ABHR visual anchor with CC, PP, and Grand Total cards
│   │   ├── EntryForm.tsx           # Quick-entry row form with live calculation preview
│   │   ├── DataTable.tsx           # Spreadsheet-inspired table with soft yellow headers
│   │   ├── EditRowModal.tsx        # Detailed row editor modal
│   │   ├── ImportExportModal.tsx   # CSV/JSON export, import & clipboard tool
│   │   ├── HelpModal.tsx           # Google Sheets formula reference & shortcuts
│   │   └── PrintView.tsx           # Paper/PDF printable ledger view
│   ├── data/
│   │   └── initialData.ts          # Sample realistic records (Maharashtra Mobile)
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces (SheetEntry, SheetTotals, etc.)
│   ├── utils/
│   │   └── formatters.ts           # INR currency formatter, CSV/JSON parser, LocalStorage
│   ├── App.tsx                     # Main dashboard coordinator
│   └── index.css                   # Tailwind CSS styling and print media queries
```
