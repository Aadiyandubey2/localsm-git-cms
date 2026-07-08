const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const getDatabaseDir = () => {
  if (process.env.VERCEL) {
    return path.join(process.cwd(), 'backend', 'data');
  }
  const pathFromCwd = path.join(process.cwd(), 'data');
  if (fs.existsSync(pathFromCwd)) {
    return pathFromCwd;
  }
  const pathFromCwdBackend = path.join(process.cwd(), 'backend', 'data');
  if (fs.existsSync(pathFromCwdBackend)) {
    return pathFromCwdBackend;
  }
  return path.join(__dirname, '../../../data');
};
const DATA_DIR = getDatabaseDir();

const generateId = () => crypto.randomBytes(12).toString('hex');

// Ensure data folder exists (wrapped in try-catch for read-only environments like Vercel)
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('[LocalJSON] Warning: Could not create local data directory:', e.message);
}

class Schema {
  constructor(definition, options = {}) {
    this.definition = definition;
    this.options = options;
    this.hooks = { pre: {} };
  }

  pre(hookName, fn) {
    if (!this.hooks.pre[hookName]) {
      this.hooks.pre[hookName] = [];
    }
    this.hooks.pre[hookName].push(fn);
  }
}

// Thenable chainable Query class
class Query {
  constructor(execPromise) {
    this._execPromise = execPromise;
  }

  then(onFulfilled, onRejected) {
    return this._execPromise().then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this._execPromise().catch(onRejected);
  }

  sort(sortObj) {
    const originalExec = this._execPromise;
    this._execPromise = () => originalExec().then(items => {
      if (!Array.isArray(items)) {
        return items;
      }
      const key = Object.keys(sortObj)[0];
      const order = sortObj[key];
      
      const sorted = [...items].sort((a, b) => {
        let valA = a[key];
        let valB = b[key];
        
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;
 
        if (typeof valA === 'string') {
          return order === -1 ? valB.localeCompare(valA) : valA.localeCompare(valB);
        }
        return order === -1 ? valB - valA : valA - valB;
      });
      return sorted;
    });
    return this;
  }

  select(fieldsString) {
    return this;
  }
}

// Helper to make GitHub REST API requests
const gitHubRequest = async (method, relativePath, body = null) => {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !repo) {
    return null;
  }

  const encodedPath = relativePath.split('/').map(encodeURIComponent).join('/');
  const url = `https://api.github.com/repos/${repo}/contents/${encodedPath}?ref=${branch}`;
  
  const headers = {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'LocalSM-CMS-Mock-Mongoose'
  };

  const options = {
    method,
    headers
  };

  if (body) {
    options.body = JSON.stringify(body);
    options.headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, options);
  
  if (!res.ok) {
    if (res.status === 404 && method === 'GET') {
      return null;
    }
    const errText = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${errText}`);
  }

  return res.json();
};

function createModelClass(modelName, schema) {
  const filePath = path.join(DATA_DIR, `${modelName.toLowerCase()}s.json`);
  const gitHubPath = `backend/data/${modelName.toLowerCase()}s.json`;

  const readData = async () => {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;

    // Try fetching from GitHub first if configured
    if (token && repo) {
      try {
        const fileData = await gitHubRequest('GET', gitHubPath);
        if (fileData && fileData.content) {
          const decoded = Buffer.from(fileData.content, 'base64').toString('utf8');
          return JSON.parse(decoded);
        }
        return [];
      } catch (e) {
        console.error(`[GitHubDB] Failed to read ${gitHubPath} from GitHub:`, e.message);
        console.log('[GitHubDB] Falling back to local file read.');
      }
    }

    // Fallback to local files
    if (!fs.existsSync(filePath)) {
      return [];
    }
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      return [];
    }
  };

  const writeData = async (data) => {
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || 'main';

    const jsonString = JSON.stringify(data, null, 2);

    // Try writing to GitHub first if configured
    if (token && repo) {
      try {
        const fileData = await gitHubRequest('GET', gitHubPath);
        const sha = fileData ? fileData.sha : null;

        const body = {
          message: `Update database: ${modelName}s`,
          content: Buffer.from(jsonString, 'utf8').toString('base64'),
          branch
        };
        if (sha) {
          body.sha = sha;
        }

        await gitHubRequest('PUT', gitHubPath, body);
        console.log(`[GitHubDB] Successfully updated ${gitHubPath} on GitHub in real-time.`);
        
        // Also update local file in background if possible
        if (!process.env.VERCEL) {
          try {
            fs.writeFileSync(filePath, jsonString, 'utf8');
          } catch (err) {}
        }
        return;
      } catch (e) {
        console.error(`[GitHubDB] Failed to write ${gitHubPath} to GitHub:`, e.message);
        console.log('[GitHubDB] Falling back to local file write.');
      }
    }

    // Local write fallback
    if (process.env.VERCEL) {
      console.warn(`[LocalJSON] Write operation ignored in read-only Vercel environment: ${modelName}`);
      return;
    }
    fs.writeFileSync(filePath, jsonString, 'utf8');
  };

  class Model {
    constructor(data = {}) {
      Object.assign(this, data);
      if (!this._id) {
        this._id = generateId();
      }
      if (!this.createdAt) {
        this.createdAt = new Date().toISOString();
      }
      this.updatedAt = new Date().toISOString();
    }

    async save() {
      const preHooks = schema.hooks.pre['save'] || [];
      for (const fn of preHooks) {
        await fn.call(this);
      }

      this.updatedAt = new Date().toISOString();

      const items = await readData();
      const index = items.findIndex(item => item._id === this._id);
      
      const serialized = JSON.parse(JSON.stringify(this));

      if (index !== -1) {
        items[index] = serialized;
      } else {
        items.push(serialized);
      }

      await writeData(items);
      return this;
    }

    isModified(field) {
      return true;
    }

    static find(query = {}) {
      const exec = async () => {
        const items = (await readData()).map(item => new Model(item));
        return items.filter(item => {
          for (const key in query) {
            if (query[key] !== item[key]) return false;
          }
          return true;
        });
      };
      return new Query(exec);
    }

    static findOne(query = {}) {
      const exec = async () => {
        const items = await readData();
        const matched = items.find(item => {
          for (const key in query) {
            if (query[key] !== item[key]) return false;
          }
          return true;
        });
        if (!matched) return null;
        return new Model(matched);
      };
      return new Query(exec);
    }

    static findById(id) {
      const exec = async () => {
        const items = await readData();
        const matched = items.find(item => item._id === id);
        if (!matched) return null;
        return new Model(matched);
      };
      return new Query(exec);
    }

    static async findByIdAndUpdate(id, updateData, options = {}) {
      const items = await readData();
      const index = items.findIndex(item => item._id === id);
      if (index === -1) return null;

      const updatedItem = {
        ...items[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      items[index] = updatedItem;
      await writeData(items);

      return new Model(updatedItem);
    }

    static async findByIdAndDelete(id) {
      const items = await readData();
      const index = items.findIndex(item => item._id === id);
      if (index === -1) return null;

      const deletedItem = items[index];
      items.splice(index, 1);
      await writeData(items);

      return new Model(deletedItem);
    }

    static async create(data = {}) {
      const doc = new Model(data);
      await doc.save();
      return doc;
    }

    static async deleteMany(query = {}) {
      await writeData([]);
      return { deletedCount: 0 };
    }

    static async insertMany(docs) {
      const savedDocs = [];
      for (const doc of docs) {
        const instance = new Model(doc);
        await instance.save();
        savedDocs.push(instance);
      }
      return savedDocs;
    }
  }

  return Model;
}

const mockMongoose = {
  Schema,
  models: {},
  model(name, schema) {
    if (this.models[name]) {
      return this.models[name];
    }
    const modelClass = createModelClass(name, schema);
    this.models[name] = modelClass;
    return modelClass;
  },
  isValidObjectId(id) {
    return typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id);
  },
  connect: async () => {
    console.log('Mock Mongoose: Connected to local JSON file database.');
    return {
      connection: {
        host: 'LocalJSON'
      }
    };
  },
  connection: {
    readyState: 1,
    host: 'LocalJSON'
  }
};

module.exports = mockMongoose;
