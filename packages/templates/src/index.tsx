import Minimal from './templates/minimal';
import Sneakers from './templates/sneakers';

export type TemplateComponent = (props: { tenantId?: string }) => JSX.Element;

export const templatesRegistry: Record<string, TemplateComponent> = {
	minimal: Minimal,
	sneakers: Sneakers,
};

export function RenderTemplate({ slug, tenantId }: { slug: string; tenantId?: string }) {
	const Component = templatesRegistry[slug];
	if (!Component) {
		return <div style={{ padding: 16 }}>Template não encontrado: {slug}</div>;
	}
	return <Component tenantId={tenantId} />;
}