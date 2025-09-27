// Global voting API endpoint
// This would typically be deployed as a Shopify app or serverless function

// In-memory storage for demo purposes
// In production, this would use a database or Shopify metafields
let globalVotes = {};

// Get all votes
export async function GET(request) {
  try {
    const totalVotes = Object.values(globalVotes).reduce((sum, count) => sum + count, 0);
    
    return new Response(JSON.stringify({
      votes: globalVotes,
      totalVotes: totalVotes,
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
      error: 'Failed to load votes',
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

// Add a vote
export async function POST(request) {
  try {
    const body = await request.json();
    const { votes, totalVotes } = body;
    
    // Update global votes
    globalVotes = { ...globalVotes, ...votes };
    
    const newTotalVotes = Object.values(globalVotes).reduce((sum, count) => sum + count, 0);
    
    return new Response(JSON.stringify({
      votes: globalVotes,
      totalVotes: newTotalVotes,
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
      error: 'Failed to save vote',
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
