import { ClaimAnalysis } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';


export class NewsCheckAPI {
  static async analyzeClaim(originalClaim: string): Promise<ClaimAnalysis> {
    const res = await fetch(`${BASE_URL}/api/check-claim`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': 'demo-user', // optional: for history scoping
      },
      body: JSON.stringify({ claim: originalClaim }),
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      throw new Error(`API error: ${res.status} ${msg}`);
    }

    const data = await res.json();
    // Backend returns the exact ClaimAnalysis structure
    return data as ClaimAnalysis;
  }
}