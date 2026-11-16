import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data.json');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper function to read data.json
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database file, returning default structure:', error);
    return { projects: [], submissions: [] };
  }
}

// Helper function to write to data.json
async function writeData(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing to database file:', error);
    return false;
  }
}

// --- PROJECT ENDPOINTS ---

// Get all projects
app.get('/api/projects', async (req, res) => {
  const db = await readData();
  res.json(db.projects || []);
});

// Get a project by slug
app.get('/api/projects/:slug', async (req, res) => {
  const db = await readData();
  const project = (db.projects || []).find(p => p.slug === req.params.slug);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

// Create or update a project (left as an endpoint for future backend panel integration)
app.post('/api/projects', async (req, res) => {
  const { id, slug, title, subtitle, year, description, role, team, timeline, heroEmoji, gradientFrom, gradientTo, tags, category, gridWidth, links, featured } = req.body;
  
  if (!id || !slug || !title || !description || !role || !tags || !category || !gridWidth) {
    return res.status(400).json({ error: 'Missing required project fields' });
  }

  const db = await readData();
  if (!db.projects) db.projects = [];

  const existingIndex = db.projects.findIndex(p => p.id === id || p.slug === slug);
  const newProject = {
    id,
    slug,
    title,
    subtitle: subtitle || '',
    year: year || new Date().getFullYear().toString(),
    description,
    role,
    team: team || 'Personal Project',
    timeline: timeline || 'Ongoing',
    heroEmoji: heroEmoji || '🚀',
    gradientFrom: gradientFrom || 'rgba(255,92,0,0.2)',
    gradientTo: gradientTo || 'rgba(0,0,0,0)',
    tags,
    category,
    gridWidth: parseInt(gridWidth) || 6,
    links: links || [],
    featured: !!featured
  };

  if (existingIndex > -1) {
    db.projects[existingIndex] = newProject;
  } else {
    db.projects.push(newProject);
  }

  const success = await writeData(db);
  if (!success) {
    return res.status(500).json({ error: 'Failed to write project to database' });
  }

  res.status(201).json({ message: 'Project saved successfully', project: newProject });
});

// --- SUBMISSION ENDPOINTS ---

// Get all submissions
app.get('/api/submissions', async (req, res) => {
  const db = await readData();
  res.json(db.submissions || []);
});

// Post a new contact submission
app.post('/api/submissions', async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const db = await readData();
  if (!db.submissions) db.submissions = [];

  const newSubmission = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    email,
    subject: subject || 'General Inquiry',
    message,
    createdAt: new Date().toISOString()
  };

  db.submissions.unshift(newSubmission); // Add to the beginning of the list

  const success = await writeData(db);
  if (!success) {
    return res.status(500).json({ error: 'Failed to record contact submission' });
  }

  res.status(201).json({ message: 'Submission recorded successfully', submission: newSubmission });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
