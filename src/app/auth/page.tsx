// app/auth/page.tsx
import AuthSlider from "@/src/components/AuthSlider"

export const metadata = {
  title: 'Autenticación',
}

export default function AuthPage() {
  return <div className="w-[80%] h-[80%]"><AuthSlider /></div>
}
