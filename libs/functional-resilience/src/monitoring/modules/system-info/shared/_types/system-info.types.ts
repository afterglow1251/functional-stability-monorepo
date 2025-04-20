// Type for CPU statistics
export type Cpu = {
  currentLoad: number; // The overall CPU load (percentage)
  currentLoadUser: number; // The user-space CPU load (percentage)
  currentLoadSystem: number; // The system-space CPU load (percentage)
  currentLoadIdle: number; // The idle CPU time (percentage)
};

// Type for Memory statistics
export type Memory = {
  total: number; // Total physical memory in bytes
  free: number; // Free memory in bytes
  used: number; // Used memory in bytes
  available: number; // Available memory in bytes
  swapused: number; // Swap memory used in bytes
  swapfree: number; // Swap memory free in bytes
};

// Type for Disk statistics
export type Disk = {
  fs: string; // File system (e.g., 'C:', 'D:')
  type: string; // File system type (e.g., 'NTFS')
  size: number; // Total disk size in bytes
  used: number; // Used disk space in bytes
  available: number; // Available disk space in bytes
  use: number; // Disk usage percentage
  mount: string; // Mount point (e.g., 'C:')
  rw: boolean | null; // Whether the disk is read/write (true/false)
};

// Type for Process Load statistics
export type ProcessLoad = {
  proc: string; // Process name (e.g., 'node')
  pid: number; // Process ID
  pids: number[]; // Array of related PIDs
  cpu: number; // CPU usage by the process (percentage)
  mem: number; // Memory usage by the process (percentage)
};

// Type for the overall system monitoring data structure
export type SystemInfo = {
  timestamp: string; // Timestamp of the data
  cpu: Cpu; // CPU statistics
  memory: Memory; // Memory statistics
  disk: Disk[]; // Array of disk statistics
  processLoad: ProcessLoad[]; // Array of process load statistics
};
