export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const tenantId = searchParams.get('tenantId') || 'tenant-default';
	return Response.json({
		tenant: {
			id: tenantId,
			name: tenantId.replace(/^tenant-/, ''),
			primary_color: '#111827',
			secondary_color: '#6366f1',
			logo_url: null,
			delivery_message: 'Entrega em até 48h em todo o Brasil',
		},
	});
}