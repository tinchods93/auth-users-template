import jwt from 'jsonwebtoken';

export default function validateTokenScopes(token: string): boolean {
  if (!token) {
    return false;
  }

  token = token.trim().replace('Bearer ', '').trim();
  const decodedToken = jwt.decode(token) as { scopes: string };

  const cognitoGroup = decodedToken['cognito:groups']?.[0] as string;

  if (!cognitoGroup) {
    return false;
  }

  const envKey = `${cognitoGroup.toUpperCase()}_GROUP_SCOPES`;

  const requiredScopes = process.env.REQUIRED_TOKEN_SCOPES as string;
  const tokenScopes = process.env[envKey] as string;

  return tokenScopes.includes(requiredScopes);
}
