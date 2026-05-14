import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', backgroundColor: '#060B14', color: '#EF4444', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>⚠️ التطبيق واجه خطأ (React Crash)</h1>
          <p style={{ marginBottom: '1rem', color: '#8896A4' }}>لقد اصطدنا الخطأ! أرسل لي لقطة شاشة لهذا النص:</p>
          <div style={{ backgroundColor: '#0D1219', padding: '1rem', borderRadius: '8px', border: '1px solid #1E2D3D', overflowX: 'auto' }}>
            <h2 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{this.state.error?.toString()}</h2>
            <pre style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
              {this.state.errorInfo?.componentStack}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
