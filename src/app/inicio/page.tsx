// app/inicio/page.tsx
import { redirect } from 'next/navigation'

export default function InicioPage() {
    redirect('/inicio/feed')
}
