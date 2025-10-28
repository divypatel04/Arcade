import React, { Component, ReactNode, ErrorInfo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '@theme';
import { Icon } from './Icon';
import { captureError, getUserMessage, type AppError } from '@utils/errorHandling';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error with enhanced error handling
    const appError = captureError(error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const appError = this.state.error ? captureError(this.state.error) : null;
      const userMessage = appError ? getUserMessage(appError) : 'We\'ve encountered an unexpected error.';

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Icon name="alert-circle" size={72} color={theme.colors.error} />
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>{userMessage}</Text>
            {__DEV__ && this.state.error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{this.state.error.message}</Text>
                <Text style={styles.errorText}>{this.state.error.stack}</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={this.handleReset}
              activeOpacity={0.8}
            >
              <Icon name="refresh" size="md" color={theme.colors.white} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.sizes.xl,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: theme.sizes.lg,
    marginBottom: theme.sizes.md,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.sizes.xl,
    lineHeight: 24,
  },
  errorBox: {
    backgroundColor: theme.colors.error,
    opacity: 0.1,
    borderRadius: theme.sizes.borderRadius.md,
    padding: theme.sizes.md,
    marginBottom: theme.sizes.lg,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    fontFamily: 'monospace',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.sizes.md,
    paddingHorizontal: theme.sizes.xl,
    borderRadius: theme.sizes.borderRadius.md,
  },
  buttonIcon: {
    marginRight: theme.sizes.sm,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.white,
  },
});

export default ErrorBoundary;
