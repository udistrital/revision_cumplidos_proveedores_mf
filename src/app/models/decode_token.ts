export interface DecodedToken {
    at_hash: string;
    sub: string;
    aud: string[];
    role: string[];
    azp: string;
    iss: string;
    documento: string;
    documento_compuesto: string;
    exp: number;
    nonce: string;
    iat: number;
    email: string;
  }