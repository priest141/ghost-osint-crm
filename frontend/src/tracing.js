import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { defaultResource } from '@opentelemetry/resources';

const provider = new WebTracerProvider({
    resource: defaultResource.merge({
        attributes: {
            'service.name': 'ghost-osint-frontend',
        }
    }),
});

// For client-side React, environmental variables are baked in at build time. 
// Ensure REACT_APP_OTEL_URL is set in your build environment, or hardcode it for your lab.
const exporter = new OTLPTraceExporter({
    url: process.env.REACT_APP_OTEL_URL || "https://openobserve-production-2c62.up.railway.app/api/default/v1/traces",
    headers: {
        Authorization: "Basic YW5kcmVsc2FuZHJhZGU0MkBnbWFpbC5jb206bzJvaV8zUjBkaWhpa1I2WkFuU2w5MmZpQ1NhOTVaWk5iZkdTZw==",
        "stream-name": "default"
    }
});

provider.addSpanProcessor(new BatchSpanProcessor(exporter));
provider.register({
    contextManager: new ZoneContextManager(),
});

registerInstrumentations({
    instrumentations: [
        getWebAutoInstrumentations({
            // Ensures your frontend traces can link to your backend traces
            '@opentelemetry/instrumentation-fetch': {
                propagateTraceHeaderCorsUrls: [
                    "ghost-backend-prd.up.railway.app" // Replace with your actual backend URL/regex
                ],
            },
        }),
    ],
});