// Example: Declare a global type
type Nullable<T> = T | null;

// Example: Declare a global variable
declare const __DEV__: boolean;

// ...add more global types or declarations as needed...

import 'express';
declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}
