import EditForm from './EditForm'

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <main className="bg-black min-h-screen">
      <EditForm id={id} />
    </main>
  )
}
