export async function GET() {
  try {
    console.log('Fetching weather data from NEA...');
    
    const [wbgtRes, tempRes] = await Promise.all([
      fetch('https://api.data.gov.sg/v1/environment/wet-bulb-globe-temperature', {
        cache: 'no-store'
      }),
      fetch('https://api.data.gov.sg/v1/environment/air-temperature', {
        cache: 'no-store'
      })
    ]);

    console.log('WBGT status:', wbgtRes.status);
    console.log('Temp status:', tempRes.status);

    if (!wbgtRes.ok || !tempRes.ok) {
      return Response.json({ 
        error: 'API request failed',
        wbgtStatus: wbgtRes.status,
        tempStatus: tempRes.status
      }, { status: 502 });
    }

    const wbgtData = await wbgtRes.json();
    const tempData = await tempRes.json();

    // Log the structure to debug
    console.log('WBGT data structure:', JSON.stringify(wbgtData, null, 2).substring(0, 500));

    return Response.json({
      wbgt: wbgtData,
      temperature: tempData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('API route error:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
