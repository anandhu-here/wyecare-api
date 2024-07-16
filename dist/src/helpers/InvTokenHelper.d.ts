import jwt from "jsonwebtoken";
declare class TokenServiceHelper {
    static verifyToken(token: string): Promise<{
        invitation: import("mongoose").Document<unknown, {}, import("../interfaces/entities/invitations").IJoinInvitation> & import("../interfaces/entities/invitations").IJoinInvitation & Required<{
            _id: unknown;
        }>;
        decoded: jwt.JwtPayload;
    }>;
    static isTokenExpired(expiresAt: number): Promise<boolean>;
}
export default TokenServiceHelper;
