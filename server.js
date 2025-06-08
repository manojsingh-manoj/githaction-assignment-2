const express = require('express');
const appInsights = require('applicationinsights');
const app = express();
const port = process.env.PORT || 3000;
const version = process.env.VERSION || "unknown";
const InstrumentationKey = process.env.APPINSIGHTS_INSTRUMENTATIONKEY;
appInsights.setup(`InstrumentationKey=${InstrumentationKey}`)
  .setAutoCollectConsole(true, true)
  .start();

const client = appInsights.defaultClient;

console.log('Hello, Azure Monitor!');

app.get('/health', (req, res) => {

  client.trackEvent({
    name: "ErrorEvent",
    properties: {
      version: version,
      errorMessage: "Error:Something went wrong"
    }
  });
    const isHealthy = Math.random() > 0.5;

  client.trackEvent({
    name: "HealthCheck",
    properties: { status: isHealthy ? "Healthy" : "Unhealthy" }
  });
  
  const healthStatus = isHealthy ? "Healthy" : "Unhealthy";
  //console.log(`Health Check version: ${healthStatus}`);
  console.log(`Health Check version: ${version}, Status: ${healthStatus}`);
  res.status(isHealthy ? 200 : 500).send(healthStatus);

});

app.get('/', (req, res) => {
  res.send('Hello from Node.js');
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
