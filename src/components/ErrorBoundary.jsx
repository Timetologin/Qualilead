import React, { Component } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });

    // Log error to console (in production, send to error tracking service)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <div className="error-icon">
              <AlertCircle size={64} />
            </div>
            <h1>Oops! Something went wrong</h1>
            <p>We're sorry, but something unexpected happened. Please try refreshing the page.</p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Error Details</summary>
                <pre>{this.state.error.toString()}</pre>
                {this.state.errorInfo && (
                  <pre>{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            )}

            <div className="error-actions">
              <button onClick={this.handleRefresh} className="btn btn-primary">
                <RefreshCw size={18} />
                Refresh Page
              </button>
              <button onClick={this.handleGoHome} className="btn btn-secondary">
                <Home size={18} />
                Go Home
              </button>
            </div>
          </div>

          <style>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #0a1628 0%, #1a2744 100%);
              padding: 2rem;
            }

            .error-content {
              text-align: center;
              max-width: 500px;
              padding: 3rem;
              background: #1e2d3d;
              border: 1px solid #2a3f54;
              border-radius: 16px;
            }

            .error-icon {
              color: #ef4444;
              margin-bottom: 1.5rem;
            }

            .error-content h1 {
              color: #ffffff;
              font-size: 1.75rem;
              margin-bottom: 1rem;
            }

            .error-content p {
              color: #b8c5d1;
              margin-bottom: 2rem;
              line-height: 1.6;
            }

            .error-details {
              text-align: left;
              margin-bottom: 2rem;
              padding: 1rem;
              background: #0a1628;
              border-radius: 8px;
              color: #ef4444;
              font-size: 0.875rem;
            }

            .error-details summary {
              cursor: pointer;
              color: #b8c5d1;
              margin-bottom: 0.5rem;
            }

            .error-details pre {
              overflow-x: auto;
              white-space: pre-wrap;
              word-wrap: break-word;
              margin: 0.5rem 0;
            }

            .error-actions {
              display: flex;
              gap: 1rem;
              justify-content: center;
              flex-wrap: wrap;
            }

            .btn {
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              padding: 0.75rem 1.5rem;
              border-radius: 8px;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s;
              border: none;
              font-size: 1rem;
            }

            .btn-primary {
              background: #d4af37;
              color: #0a1628;
            }

            .btn-primary:hover {
              background: #e5c349;
            }

            .btn-secondary {
              background: #2a3f54;
              color: #ffffff;
            }

            .btn-secondary:hover {
              background: #3a5169;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
