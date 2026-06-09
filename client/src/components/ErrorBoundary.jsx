import React from "react";
import Button from "./ui/Button";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6">
          <div className="glass rounded-3xl p-8 text-center shadow-neon">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-200">Nova Forms AI</p>
            <h1 className="mt-4 font-display text-3xl font-bold text-slate-900 dark:text-white">
              Something broke in the builder.
            </h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              Refresh the page to recover. Your saved forms are still safe on the server.
            </p>
            <Button className="mt-6" onClick={() => window.location.reload()}>
              Reload app
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
