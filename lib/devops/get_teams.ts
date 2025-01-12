import axios from 'axios';

const API_ROOT = 'http://localhost:8001';
axios.defaults.baseURL = API_ROOT;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.withCredentials = true;

export interface Team {
  id: string;
  name: string;
  // Add other team properties as needed
}

/**
 * Fetches all teams from the API
 * @returns Promise with array of teams
 */
export async function getAllPaths(): Promise<Team[]> {
  try {
    console.log('Calling getAllPaths api');
    const response = await axios.get('get_all_paths');

    if (response.status !== 200) {
      throw new Error(`Failed to fetch teams: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
}

export async function getAllIterations(): Promise<Team[]> {
  try {
    console.log('Calling getAllIterations api');
    const response = await axios.get('get_iteration_paths');
    return response.data;
  } catch (error) {
    console.error('Error fetching iterations:', error);
    throw error;
  }
}
