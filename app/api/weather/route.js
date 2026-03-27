export async function GET() {
  try {
    const [wbgtRes, tempRes] = await Promise.all([
      fetch('https://api.data.gov.sg/v1/environment/wet-bulb-globe-temperature', {
        cache: 'no-store'
      }),
      fetch('https://api.data.gov.sg/v1/environment/air-temperature', {
        cache: 'no-store'
      })
    ]);

    if (!wbgtRes.ok || !tempRes.ok) {
      return Response.json({ 
        error: 'API request failed' 
      }, { status: 502 });
    }

    const wbgtData = await wbgtRes.json();
    const tempData = await tempRes.json();

    return Response.json({
      wbgt: wbgtData,
      temperature: tempData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
}
