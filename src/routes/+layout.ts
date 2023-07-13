import { SERVER_URL } from '$lib/costants.js';
import { loadData } from '$lib/utils.js';
import ky from 'ky';

export async function load({ params }) {
    console.log('Reloading domains_data');

    return {
        domainsData: await loadData('data/domains_data')
    };
}