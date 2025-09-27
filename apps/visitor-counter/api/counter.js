// Visitor Counter API endpoint
// This tracks unique visitors to the site

// In-memory storage for demo purposes
// In production, this would use a database or Shopify metafields
let visitorCount = 0;
let uniqueVisitors = new Set();

// Get current visitor count
export async function GET(request) {
  try {
    return new Response(JSON.stringify({
      visitorCount: visitorCount,
      uniqueVisitors: uniqueVisitors.size,
      success: true
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to load visitor count',
      success: false
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Track a new visitor
export async function POST(request) {
  try {
    const body = await request.json();
    const { visitorId, isUnique } = body;
    
    // Increment total visitor count
    visitorCount++;
    
    // Track unique visitors
    if (isUnique && visitorId) {
      uniqueVisitors.add(visitorId);
    }
    
    return new Response(JSON.stringify({
      visitorCount: visitorCount,
      uniqueVisitors: uniqueVisitors.size,
      success: true
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Failed to track visitor',
      success: false
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle CORS preflight requests
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
