import { getToken, logout } from './auth';

const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';

export async function graphqlClient<T>(query: string, variables?: any): Promise<T> {
  const token = getToken();
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const result = await response.json();
    if (result.errors) {
      if (result.errors.some((e: any) => e.message === 'Unauthorized' || e.message?.includes('Unauthorized'))) {
        logout();
      }
      throw new Error(result.errors[0].message);
    }

    return result.data;
  } catch (err: any) {
    if (err.message === 'Unauthorized' || err.message?.includes('Unauthorized')) {
      logout();
    }
    throw err;
  }
}
