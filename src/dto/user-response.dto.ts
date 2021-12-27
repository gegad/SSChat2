import { TokenPair } from "src/interfaces/token.interface";

export class UserResponseDto {
    status: boolean;
    description: string;
    token: TokenPair;
}