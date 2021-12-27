import { TokenPair } from "src/interfaces/token.interface";

export class UserMessageDto {
    message: string;
    date: Date;
    newTokenPair?: TokenPair;
    user?: {
        name: string;
        id?: string;
    }    
}

