import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
if (!JWT_SECRET) {
    throw new Error('Debe definir la variable de entorno JWT_SECRET')
}

export interface JwtPayload {
    sub: string | number
    email?: string
    iat?: number
    exp?: number
}

/**
 * Firma un payload y devuelve el token JWT.
 */
export function signJwt(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, JWT_SECRET, {
        algorithm: 'HS256',
        expiresIn: '7d',       // ajusta duración si lo necesitas
    })
}

/**
 * Verifica un token JWT y devuelve su payload.
 * Lanza si el token no es válido o ha expirado.
 */
export function verifyJwt(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
}