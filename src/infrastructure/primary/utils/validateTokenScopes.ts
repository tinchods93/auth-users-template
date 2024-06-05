import jwt from 'jsonwebtoken';

export default function validateTokenScopes(token: string): boolean {
  if (!token) {
    return false;
  }

  token = token.trim().replace('Bearer ', '').trim();
  const decodedToken = jwt.decode(token) as { scopes: string };
  console.log('MARTIN_LOG=> decodedToken', decodedToken);

  const cognitoGroup = decodedToken['cognito:groups']?.[0] as string;
  console.log('MARTIN_LOG=> cognitoGroup', cognitoGroup);

  if (!cognitoGroup) {
    return false;
  }

  const envKey = `${cognitoGroup.toUpperCase()}_GROUP_SCOPES`;
  console.log('MARTIN_LOG=> envKey', envKey);

  const requiredScopes = process.env.REQUIRED_TOKEN_SCOPES as string;
  const tokenScopes = process.env[envKey] as string;
  console.log('MARTIN_LOG=> tokenScopes', tokenScopes);
  console.log('MARTIN_LOG=> requiredScopes', requiredScopes);

  return tokenScopes.includes(requiredScopes);
}
