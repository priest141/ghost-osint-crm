const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

// Explicitly pass the URL and Headers to bypass auto-detection failures
const traceExporter = new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
    headers: {
        Authorization: "Basic YW5kcmVsc2FuZHJhZGU0MkBnbWFpbC5jb206bzJvaV8zUjBkaWhpa1I2WkFuU2w5MmZpQ1NhOTVaWk5iZkdTZw==",
        "stream-name": "cloud_infrastructure"
    }
});

const sdk = new NodeSDK({
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();