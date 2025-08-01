import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Bakery App Error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border-2 border-red-200 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-2xl">😞</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Нещо се обърка!
            </h1>
            <p className="text-gray-600 mb-6">
              Възникна неочаквана грешка. Моля, опитайте отново или се свържете с нас.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
            >
              Презареди страницата
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left bg-gray-100 p-4 rounded-lg">
                <summary className="font-bold cursor-pointer">Детайли за грешката</summary>
                <pre className="text-sm text-red-600 mt-2 overflow-auto">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Get root element
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// Render app with error boundary
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Web Vitals (optional performance monitoring)
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

// Enable performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  reportWebVitals(console.log);
}

// Service Worker registration for PWA
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}