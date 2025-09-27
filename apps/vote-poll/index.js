// Simple voting endpoint for product polls
// This would typically be deployed as a Shopify app or serverless function

const express = require('express');
const app = express();

// In-memory storage for demo purposes
// In production, this would use a database or Shopify metafields
let pollVotes = {};

app.use(express.json());

// Get votes for a poll section
app.get('/apps/vote-poll', (req, res) => {
  const sectionId = req.query.section_id;
  
  if (!sectionId) {
    return res.status(400).json({ error: 'Section ID required' });
  }
  
  const votes = pollVotes[sectionId] || {};
  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);
  
  res.json({
    votes,
    totalVotes,
    sectionId
  });
});

// Add a vote
app.post('/apps/vote-poll', (req, res) => {
  const { section_id, vote_key, action } = req.body;
  
  if (!section_id || !vote_key) {
    return res.status(400).json({ error: 'Section ID and vote key required' });
  }
  
  if (!pollVotes[section_id]) {
    pollVotes[section_id] = {};
  }
  
  if (action === 'add') {
    pollVotes[section_id][vote_key] = (pollVotes[section_id][vote_key] || 0) + 1;
  }
  
  const votes = pollVotes[section_id];
  const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);
  
  res.json({
    votes,
    totalVotes,
    sectionId: section_id,
    success: true
  });
});

// For demo purposes, we'll create a simple HTML page to simulate the endpoint
// In production, this would be deployed as a proper serverless function
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Vote Poll API</title></head>
      <body>
        <h1>Vote Poll API</h1>
        <p>This is a demo voting endpoint. In production, this would be deployed as a serverless function.</p>
        <h2>Current Votes:</h2>
        <pre>${JSON.stringify(pollVotes, null, 2)}</pre>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Vote Poll API running on port ${PORT}`);
});

module.exports = app;
