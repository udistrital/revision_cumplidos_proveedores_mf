import { Injectable } from "@angular/core";

interface DecodedToken {
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
  

  @Injectable({
    providedIn: 'root',
  })
  export class TokenService {
    private static localStorageTokenKey = 'id_token';
  
    private static base64UrlDecode(base64Url: string): string {
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const padding = base64.length % 4;
      if (padding) {
        base64 += '='.repeat(4 - padding);
      }
      return atob(base64);
    }
  
    public static getToken(): string | null {
      return localStorage.getItem(this.localStorageTokenKey);
    }
  
    public static getPayload(): DecodedToken | null {
      const token = this.getToken();
      if (!token) {
        console.error('No se encontró el token en el local storage.');
        return null;
      }
  
      try {
        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error('Token inválido');
        }
        const payload = parts[1];
        const decodedPayload = this.base64UrlDecode(payload);
        const parsedToken: DecodedToken = JSON.parse(decodedPayload);
        return parsedToken;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
}