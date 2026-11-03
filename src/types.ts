export interface Complaint {
  id: number;
  studentName: string;
  uid: string;
  roomNo: string;
  category: string;
  description: string;
  status: 'Pending' | 'Completed' | string;
}

export interface CBackendStatus {
  status: string;
  gccVersion: string;
  binaryPath: string;
  binaryCompiled: boolean;
  dataFileExists: boolean;
  dataFileSize: string;
  author: string;
  cFunctions: string[];
}
