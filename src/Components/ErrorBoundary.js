import { Component } from "react";
import Dialog from "./Dialog";

// Error catching hook is only available with class components
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    // You can also log error messages to an error reporting service here
    console.error(error);
  }

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <>
          {this.props.children}
          <Dialog title={"Something went wrong"}>
            <details style={{ whiteSpace: "pre-wrap" }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
          </Dialog>
        </>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}
