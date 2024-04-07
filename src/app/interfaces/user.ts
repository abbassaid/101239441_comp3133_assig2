export interface User {
    id: string;
    email: string;
    password: string;
    username: string;
}

export interface newUser {
    email: string;
    password: string;
    username: string;
}

export interface UserResponse {
    message: string;
    user: User;
}
