/**
 * Egy lista a nyilvánosan elérhető útvonalakról.
 * Ezek az útvonalak nem igényelnek bejelentkezést.
 * @type {string[]}
 */

export const publicRoutes = [
    "/",
    "/auth/new-verification",
    "/leaderboard",
    "/api/scores"
]

/**
 * Egy lista a nyilvánosan NEM elérhető útvonalakról.
 * Ezek az útvonalak bejelentkezést igényelnek.
 * Ezek az útvonalak visszairányítják a felhasználót a főoldalra
 * @type {string[]}
 */

export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password"
]


/**
 * Az API autentikációs útvonalak előtagja.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth"

/**
 * Az alapértelmezett átirányítási útvonal bejelentkezés után
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/"