export default function TemplateSlugPage({ params, searchParams }: { params: { slug: string }, searchParams: { tenantId?: string } }) {
	const { slug } = params;
	const qs = new URLSearchParams();
	if (searchParams?.tenantId) qs.set('tenantId', searchParams.tenantId);
	const src = `/_templates/${slug}${qs.toString() ? `?${qs.toString()}` : ''}`;
	return (
		<div className="min-h-[60vh]">
			<iframe title={`preview-${slug}`} src={src} className="w-full h-[80vh] border rounded" />
		</div>
	);
}