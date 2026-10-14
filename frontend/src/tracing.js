import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ZoneContextManager } from '@opentelemetry/context-zone';

// Initialize the provider cleanly without custom Resource overrides
const provider = new WebTracerProvider();

const exporter = new OTLPTraceExporter({
    url: process.env.REACT_APP_OTEL_URL || "https://openobserve-production-2c62.up.railway.app/api/default/v1/traces",
    headers: {
        Authorization: "Basic YW5kcmVsc2FuZHJhZGU0MkBnbWFpbC5jb206bzJvaV8zUjBkaWhpa1I2WkFuU2w5MmZpQ1NhOTVaWk5iZkdTZw==",
        "stream-name": "default"
    }
});

// These methods will now work correctly
provider.addSpanProcessor(new BatchSpanProcessor(exporter));

provider.register({
    contextManager: new ZoneContextManager(),
});

registerInstrumentations({
    instrumentations: [
        getWebAutoInstrumentations({
            '@opentelemetry/instrumentation-fetch': {
                propagateTraceHeaderCorsUrls: [
                    "/.*/" // You can restrict this to your specific Express backend URL later
                ],
            },
        }),
    ],
});