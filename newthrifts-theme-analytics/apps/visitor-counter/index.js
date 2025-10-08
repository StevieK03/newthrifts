// Visitor Counter API server
// This would typically be deployed as a Shopify app or serverless function

const express = require('express');
const app = express();

// In-memory storage for demo purposes
// In production, this would use a database or Shopify metafields
let visitorCount = 0;
let uniqueVisitors = new Set();

app.use(express.json());

// Get current visitor count
app.get('/apps/visitor-counter', (req, res) => {
  res.json({
    visitorCount: visitorCount,
    uniqueVisitors: uniqueVisitors.size,
    success: true
  });
});

// Track a new visitor
app.post('/apps/visitor-counter', (req, res) => {
  const { visitorId, isUnique } = req.body;
  
  // Increment total visitor count
  visitorCount++;
  
  // Track unique visitors
  if (isUnique && visitorId) {
    uniqueVisitors.add(visitorId);
  }
  
  res.json({
    visitorCount: visitorCount,
    uniqueVisitors: uniqueVisitors.size,
    success: true
  });
});

// For demo purposes, we'll create a simple HTML page to simulate the endpoint
// In production, this would be deployed as a proper serverless function
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Visitor Counter API</title></head>
      <body>
        <h1>Visitor Counter API</h1>
        <p>This is a demo visitor counter endpoint. In production, this would be deployed as a serverless function.</p>
        <h2>Current Stats:</h2>
        <p>Total Visitors: ${visitorCount}</p>
        <p>Unique Visitors: ${uniqueVisitors.size}</p>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Visitor Counter API running on port ${PORT}`);
});

module.exports = app;



