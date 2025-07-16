# DBF Viewer

A modern React web application for viewing Visual FoxPro 9 .dbf files and performing diffs between two versions of the same file.

## 🚀 Live Demo

- **Deployed Application**: [https://sywymqkh.manus.space](https://sywymqkh.manus.space)
- **GitHub Repository**: [https://github.com/makhfi900/dbf-viewer](https://github.com/makhfi900/dbf-viewer)

## ✨ Features

### File Viewing
- **Upload and Parse**: Support for Visual FoxPro 9 .dbf files
- **Table Display**: Responsive table with pagination, sorting, and search
- **Field Information**: View field structure, types, and metadata
- **File Metadata**: Display file information including last update date and record count

### File Comparison
- **Side-by-Side Comparison**: Upload two .dbf files for comparison
- **Diff Analysis**: Comprehensive difference detection including:
  - Added, removed, and modified records
  - Field structure changes
  - Data type modifications
- **Visual Highlighting**: Color-coded differences for easy identification
- **Summary Statistics**: Overview of changes with counts and percentages

### User Experience
- **Responsive Design**: Works on desktop and mobile devices
- **Drag & Drop**: Easy file upload with drag and drop support
- **Error Handling**: Robust error boundaries and user-friendly error messages
- **Loading States**: Clear feedback during file processing

## 🛠️ Technology Stack

- **Frontend**: React 19 with Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React
- **DBF Parsing**: Custom browser-compatible parser
- **Deployment**: Netlify

## 📋 Supported DBF Features

### File Types
- Visual FoxPro 9 (.dbf files)
- dBase III/IV compatibility
- Various field types: Character, Numeric, Date, Logical, Memo

### Field Types
- **C** - Character (text)
- **N** - Numeric (integers and decimals)
- **F** - Float (floating-point numbers)
- **I** - Integer
- **D** - Date (YYYY-MM-DD format)
- **L** - Logical (boolean)
- **M** - Memo (large text)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/makhfi900/dbf-viewer.git
   cd dbf-viewer
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
pnpm run build
# or
npm run build
```

The built files will be in the `dist/` directory.

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── DbfTable.jsx     # Table display component
│   ├── DiffViewer.jsx   # File comparison component
│   ├── ErrorBoundary.jsx # Error handling
│   └── FileUpload.jsx   # File upload component
├── hooks/
│   └── useDbfParser.js  # DBF parsing hook
├── utils/
│   └── dbfDiff.js       # File comparison logic
├── App.jsx              # Main application
└── main.jsx             # Entry point
```

## 🧪 Testing

The project includes sample DBF files for testing:

```bash
# Generate sample DBF files
python3 create_sample_dbf.py
```

This creates:
- `employees_v1.dbf` - Sample employee database
- `employees_v2.dbf` - Modified version for diff testing
- `products.dbf` - Sample product database

## 🔧 DBF Parser Implementation

The application includes a custom DBF parser built specifically for browser environments:

### Features
- Pure JavaScript implementation
- Supports Visual FoxPro 9 format
- Handles various field types
- Browser-compatible (no Node.js dependencies)
- Memory efficient for large files

### Limitations
- Memo fields (.fpt files) not fully supported
- Some advanced Visual FoxPro features may not be available
- Large files (>100MB) may cause performance issues

## 🎨 UI Components

Built with modern UI components:
- **shadcn/ui**: High-quality, accessible components
- **Tailwind CSS**: Utility-first styling
- **Lucide Icons**: Beautiful, consistent icons
- **Responsive Design**: Mobile-first approach

## 🚀 Deployment

### Netlify (Current)
The application is deployed on Netlify with automatic builds from the main branch.

### Manual Deployment
1. Build the project: `pnpm run build`
2. Deploy the `dist/` folder to any static hosting service

### Environment Variables
No environment variables required for basic functionality.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🐛 Known Issues

- File upload dialog may not work in some sandboxed environments
- Very large DBF files (>50MB) may cause browser performance issues
- Memo field content is not fully displayed

## 🔮 Future Enhancements

- [ ] Support for .fpt memo files
- [ ] Export functionality (CSV, JSON)
- [ ] Advanced filtering and search
- [ ] Batch file processing
- [ ] Database schema visualization
- [ ] Print/PDF export of tables

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/makhfi900/dbf-viewer/issues) page
2. Create a new issue with detailed information
3. Include sample files if possible (ensure no sensitive data)

## 🙏 Acknowledgments

- Visual FoxPro community for DBF format documentation
- shadcn/ui for excellent React components
- Tailwind CSS for utility-first styling
- React team for the amazing framework

