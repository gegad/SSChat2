import { User } from "src/users/user.entity";

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface DecodeResult {
    user: User;
    newTokenPair?: TokenPair;
}

export interface DecodedToken {
    id: string;
    name: string;
}