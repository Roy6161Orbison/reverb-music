import EditForm from './EditForm'

export default function EditPage({ params }: { params: { id: string } }) {
  return (
    <main className="bg-black min-h-screen">
      <EditForm id={params.id} />
    </main>
  )
}
