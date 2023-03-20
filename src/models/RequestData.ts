export interface RequestData {
  method: string;
  path: string;
  body?: any;
  headers?: {[key: string]: string};
}
