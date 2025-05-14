'use client'

export default function FormLogin() {
  return (
    <form className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          required
          className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Contraseña</label>
        <input
          type="password"
          required
          className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Entrar
      </button>
    </form>
  )
}
