import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("App error boundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 text-center">
          <div className="max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-lg">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">
              !
            </div>
            <h2 className="text-2xl font-bold text-stone-900">Terjadi masalah pada aplikasi</h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Aplikasi mengalami error runtime. Halaman ini tidak akan blank total lagi.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="mt-6 inline-flex items-center justify-center rounded-2xl bg-mangrove-deep px-5 py-3 text-sm font-bold text-white transition hover:brightness-110"
            >
              Muat ulang halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
