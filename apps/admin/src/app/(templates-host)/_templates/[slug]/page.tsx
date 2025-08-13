import { RenderTemplate } from '@acme/templates';

export default function TemplateHostPage({ params, searchParams }: { params: { slug: string }, searchParams: { tenantId?: string } }) {
	const slug = params.slug;
	const tenantId = searchParams?.tenantId;
	return (
		<div className="bg-white">
			<RenderTemplate slug={slug} tenantId={tenantId} />
		</div>
	);
}