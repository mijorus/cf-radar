import { SERVER_URL } from '$lib/costants.js';
import ky from 'ky';

export async function load({ params }) {
    console.log('Reloading domains_data');

    return {
        domainsData: await ky.get(`${SERVER_URL}/data/domains_data.json`).json()
    };
}