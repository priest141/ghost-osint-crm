const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

const traceExporter = new OTLPTraceExporter(); // Reads endpoint/headers from ENVs automatically

const sdk = new NodeSDK({
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();