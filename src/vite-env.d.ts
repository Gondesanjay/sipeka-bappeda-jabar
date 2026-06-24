/// <reference types="vite/client" />

declare module 'react-simple-maps' {
    import * as React from 'react';

    export type GeographyGeometry = unknown;

    export const ComposableMap: React.FC<Record<string, unknown>>;
    export const Geographies: React.FC<Record<string, unknown>>;
    export const Geography: React.FC<Record<string, unknown>>;
}

declare module 'geojson' {
    export type Geometry = unknown;
    export type FeatureCollection = unknown;
}


