'use client'

export default function FormRegister() {
  return (
    <form className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Crear cuenta</h2>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          required
          className="mt-1 w-full px-3 py-2 border rounded focus:outline-none focus:ring"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Usuario</label>
        <input
          type="text"
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
        className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Registrarse
      </button>
    </form>
  )
}
