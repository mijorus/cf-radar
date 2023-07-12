import { SERVER_URL } from '$lib/costants.js';
import ky from 'ky';

export async function load({ params }) {
    console.log('reloading');

    return {
        domainsData: await ky.get(`${SERVER_URL}/data/domains_data.json`).json()
    };
}