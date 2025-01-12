import axios from 'axios';

import { JiraTicketData } from '../../types/ticket';

/**
 * Saves a list of tickets to the API
 * @param tickets Array of ticket data to be saved
 * @returns Promise with the API response
 */
const API_ROOT = 'http://localhost:8001';
axios.defaults.baseURL = API_ROOT;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.withCredentials = true;

export async function saveTickets(tickets: JiraTicketData[]): Promise<void> {
  console.log('Saving tickets:', tickets);
  try {
    console.log('Calling create_items api');
    console.log(tickets);
    const response = await axios.post('/create_items', tickets);

    if (response.status !== 200) {
      throw new Error(`Failed to save tickets: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error('Error saving tickets:', error);
    throw error;
  }
}
