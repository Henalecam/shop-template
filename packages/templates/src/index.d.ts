import type { JSX } from 'react';

export type TemplateComponent = (props: { tenantId?: string }) => JSX.Element;

export declare const templatesRegistry: Record<string, TemplateComponent>;

export declare function RenderTemplate(props: { slug: string; tenantId?: string }): JSX.Element;