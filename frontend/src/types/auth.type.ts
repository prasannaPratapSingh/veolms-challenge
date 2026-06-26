export interface registerBody {
    name: string,
    password: string,
    email: string
}

export interface loginBody {
    email: string,
    password: string
}

export interface AuthState {
    user: any,
    error: string | null,
    loading: boolean
}