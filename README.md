# KoreLang

A professional Integrated Development Environment (IDE) for constructed languages.

## 🚀 Quick Start

Follow these steps to set up the project locally:

### 1. Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### 2. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory (or use `.env.local`) and add your Google Gemini API Key:

```env
GEMINI_API_KEY=your_api_key_here
```

### 4. Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### 5. Build for Production

To create an optimized production build:

```bash
npm run build
```

The output will be in the `dist/` directory.

## 🛠 Tech Stack

- **React 18** with **TypeScript**
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **Lucide React** (Icons)
- **Google Generative AI SDK** (@google/generative-ai)
- **Recharts** (Visualizations)

## 📁 Project Structure

- `/src`: Application source code
  - `/components`: UI components
  - `/services`: API and business logic
  - `/types.ts`: TypeScript definitions
  - `/i18n.tsx`: Internationalization logic
- `/public`: Static assets
- `index.html`: Entry point
- `vite.config.ts`: Vite configuration
- `tailwind.config.js`: Tailwind styling configuration