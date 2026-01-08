import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  /**
   * Children components to be guarded by the error boundary.
   */
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Global Error Boundary component to protect the application from 
 * total crashes during runtime rendering exceptions.
 */
// Use the directly imported Component class to ensure proper TypeScript generic inheritance and access to this.props
export default class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  /**
   * Fixed: Added explicit constructor and super(props) call to ensure 
   * internal 'props' property is correctly initialized and typed.
   */
  constructor(props: Props) {
    super(props);
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console for diagnostic purposes
    console.error("Critical rendering exception caught by boundary:", error, errorInfo);
  }

  public render(): ReactNode {
    // Standard access to state and props in React class components
    if (this.state.hasError) {
      // Minimal, neutral fallback UI using existing global Tailwind and FontAwesome
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans text-slate-900">
          <div className="max-w-md w-full text-center bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-8">
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <h1 className="text-xl font-black mb-2 uppercase tracking-tight">System Exception</h1>
            <p className="text-slate-500 mb-10 text-sm font-medium leading-relaxed">
              An unexpected runtime rendering error occurred. The system has safely halted to prevent data corruption.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all text-[11px] uppercase tracking-widest shadow-lg active:scale-[0.98]"
            >
              Restart Application
            </button>
          </div>
        </div>
      );
    }

    /**
     * Fixed: Successfully inheriting from Component allows standard access to this.props.
     */
    return this.props.children || null;
  }
}
