import { useState, useCallback } from 'react';
import apiService from '@/utils/apiService';
import { AxiosRequestConfig } from 'axios';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<any>,
  immediate = false
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await apiFunction(...args);
      
      if (response.success) {
        setState(prev => ({ ...prev, data: response.data, loading: false }));
        return response.data;
      } else {
        setState(prev => ({ 
          ...prev, 
          error: response.message || 'Request failed', 
          loading: false 
        }));
        return null;
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      return null;
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Convenience hooks for common HTTP methods
export function useGet<T = any>(url: string, config?: AxiosRequestConfig) {
  return useApi<T>((url: string, config?: AxiosRequestConfig) => 
    apiService.get<T>(url, config)
  );
}

export function usePost<T = any>() {
  return useApi<T>((url: string, data?: any, config?: AxiosRequestConfig) => 
    apiService.post<T>(url, data, config)
  );
}

export function usePut<T = any>() {
  return useApi<T>((url: string, data?: any, config?: AxiosRequestConfig) => 
    apiService.put<T>(url, data, config)
  );
}

export function usePatch<T = any>() {
  return useApi<T>((url: string, data?: any, config?: AxiosRequestConfig) => 
    apiService.patch<T>(url, data, config)
  );
}

export function useDelete<T = any>() {
  return useApi<T>((url: string, config?: AxiosRequestConfig) => 
    apiService.delete<T>(url, config)
  );
}

// Example usage:
// const { data, loading, error, execute } = usePost<LoginResponse>();
// const result = await execute('/auth/login/', { email, password });