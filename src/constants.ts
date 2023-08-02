export const GOOGLE_CLIENT_ID =
  '252306307767-p74ur0m74vtd0vb8035bd7raimph6jhs.apps.googleusercontent.com';
export const GOOGLE_SECRET = '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';

export interface JwtExePayload {
  created_by: string;
  id: number;
}

export const expired = 14400;

export const ResponseMap = <T>(data: T, message?: string | ''): { data: T; message: string } => {
    return {
      data,
      message: message || ''
    };
  };
