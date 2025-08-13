export default function TemplatesIndex() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Templates</h1>
      <p>Use as rotas: /templates/[slug]?tenantId=TENANT_ID</p>
      <ul className="list-disc ml-6 mt-4 text-sm text-gray-700">
        <li>minimal</li>
        <li>skate</li>
        <li>sneakers</li>
        <li>streetwear</li>
      </ul>
    </div>
  );
}