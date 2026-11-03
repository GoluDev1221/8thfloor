import express, { Request, Response } from 'express';
import { execFile, execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const C_SRC = path.join(__dirname, 'c_backend', 'main.c');
const C_BIN = path.join(__dirname, 'c_backend', 'hostel_backend');
const DATA_FILE = path.join(__dirname, 'complaints.dat');

// Ensure C binary exists and is up-to-date with C_SRC
function ensureCBinary(): boolean {
  try {
    const binExists = fs.existsSync(C_BIN);
    const srcExists = fs.existsSync(C_SRC);

    if (!binExists || (srcExists && fs.statSync(C_SRC).mtimeMs > fs.statSync(C_BIN).mtimeMs)) {
      console.log('[C-BACKEND] Compiling c_backend/main.c with gcc...');
      execSync(`gcc -Wall -O2 "${C_SRC}" -o "${C_BIN}"`);
      console.log('[C-BACKEND] Successfully compiled C binary executable!');
    }
    return true;
  } catch (err) {
    console.error('[C-BACKEND] Compilation error:', err);
    return false;
  }
}

// Execute compiled C binary executable
function runCBackend(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    ensureCBinary();
    execFile(C_BIN, args, { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        console.error(`[C-EXEC ERROR] Command args: ${args.join(' ')}`, stderr || error.message);
        reject(stderr || stdout || error.message);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

// Helper: Safely parse JSON from C binary stdout output
function parseCJsonOutput(rawOutput: string): any {
  const trimmed = rawOutput.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const arrayStart = trimmed.indexOf('[');
    const arrayEnd = trimmed.lastIndexOf(']');
    if (arrayStart !== -1 && arrayEnd !== -1 && arrayEnd > arrayStart) {
      return JSON.parse(trimmed.substring(arrayStart, arrayEnd + 1));
    }
    const objectStart = trimmed.indexOf('{');
    const objectEnd = trimmed.lastIndexOf('}');
    if (objectStart !== -1 && objectEnd !== -1 && objectEnd > objectStart) {
      return JSON.parse(trimmed.substring(objectStart, objectEnd + 1));
    }
    throw new Error(`Failed to parse C backend output: ${trimmed}`);
  }
}

// API Route: C Compiler & Backend Diagnostic Information
app.get('/api/c-status', async (_req: Request, res: Response) => {
  try {
    let gccVersion = 'Unknown';
    try {
      gccVersion = execSync('gcc --version').toString().split('\n')[0];
    } catch {
      gccVersion = 'GCC not found';
    }

    const binExists = fs.existsSync(C_BIN);
    const datExists = fs.existsSync(DATA_FILE);
    let datSize = 0;
    if (datExists) {
      datSize = fs.statSync(DATA_FILE).size;
    }

    res.json({
      status: 'online',
      gccVersion,
      binaryPath: C_BIN,
      binaryCompiled: binExists,
      dataFileExists: datExists,
      dataFileSize: `${datSize} bytes`,
      author: 'Piyush Joshi (UID: 26BCD10227, Chandigarh University)',
      cFunctions: [
        'void addComplaint()',
        'void viewComplaints()',
        'void searchComplaint()',
        'void updateStatus()',
        'void deleteComplaint()'
      ]
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API Route: View All Complaints (Calls C Function viewComplaints())
app.get('/api/complaints', async (_req: Request, res: Response) => {
  try {
    const rawOutput = await runCBackend(['view_json']);
    if (!rawOutput || rawOutput === '[]') {
      return res.json([]);
    }
    const complaints = parseCJsonOutput(rawOutput);
    res.json(complaints);
  } catch (err: any) {
    console.error('Error in GET /api/complaints:', err);
    res.status(500).json({ error: 'Failed to read records from C binary backend.' });
  }
});

// API Route: Search Complaint by ID (Calls C Function searchComplaint())
app.get('/api/complaints/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const rawOutput = await runCBackend(['search', id]);
    const record = parseCJsonOutput(rawOutput);
    if (record.status === 'error') {
      return res.status(404).json(record);
    }
    res.json(record);
  } catch (err: any) {
    res.status(404).json({ error: 'Complaint ID not found in C binary data file.' });
  }
});

// API Route: Add Complaint (Calls C Function addComplaint())
app.post('/api/complaints', async (req: Request, res: Response) => {
  try {
    const { studentName, uid, roomNo, category, description } = req.body;
    if (!studentName || !uid || !roomNo || !category || !description) {
      return res.status(400).json({ error: 'All fields (Name, UID, Room, Category, Description) are required.' });
    }

    const rawOutput = await runCBackend([
      'add',
      studentName,
      uid,
      roomNo,
      category,
      description
    ]);

    const result = parseCJsonOutput(rawOutput);
    res.status(201).json(result);
  } catch (err: any) {
    console.error('Error in POST /api/complaints:', err);
    res.status(500).json({ error: 'C backend failed to record complaint.' });
  }
});

// API Route: Update Status (Calls C Function updateStatus())
app.patch('/api/complaints/:id/status', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    if (!status || (status !== 'Pending' && status !== 'Completed')) {
      return res.status(400).json({ error: 'Status must be either "Pending" or "Completed".' });
    }

    const rawOutput = await runCBackend(['update', id, status]);
    const result = parseCJsonOutput(rawOutput);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'C backend failed to update complaint status.' });
  }
});

// API Route: Delete Complaint (Calls C Function deleteComplaint())
app.delete('/api/complaints/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const rawOutput = await runCBackend(['delete', id]);
    const result = parseCJsonOutput(rawOutput);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: 'C backend failed to delete complaint record.' });
  }
});

// CGI Form Interfacing standard endpoint: /api/cgi-bin/complaint.cgi
app.post('/api/cgi-bin/complaint.cgi', async (req: Request, res: Response) => {
  try {
    const { studentName, uid, roomNo, category, description } = req.body;
    const rawOutput = await runCBackend([
      'add',
      studentName || 'Anonymous',
      uid || 'N/A',
      roomNo || 'N/A',
      category || 'General',
      description || 'No description provided.'
    ]);
    res.send(`
      <!DOCTYPE html>
      <html>
        <head><title>CGI Response - 8TH FLOOR</title></head>
        <body style="font-family: sans-serif; padding: 2rem; background: #FBF8EF;">
          <h2>CGI Form Submission processed by C Backend</h2>
          <pre>${rawOutput}</pre>
          <a href="/">Return to 8TH FLOOR Portal</a>
        </body>
      </html>
    `);
  } catch (err: any) {
    res.status(500).send(`CGI Error: ${err.message}`);
  }
});

// Vite Middleware integration for production & development
async function startServer() {
  ensureCBinary();

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(` 8TH FLOOR Hostel Grievance Management System Server   `);
    console.log(` Student: Piyush Joshi (UID: 26BCD10227)              `);
    console.log(` Server running on http://0.0.0.0:${PORT}               `);
    console.log(` C Binary Backend: ${C_BIN}                             `);
    console.log(`=======================================================`);
  });
}

startServer();
