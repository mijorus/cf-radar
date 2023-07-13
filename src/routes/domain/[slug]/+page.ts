import { loadData } from '$lib/utils.js';

export async function load({ params }) {
    return {
        domain: params.slug
        // domainData: (await loadData('data/domains_data'))[params.slug]
    };
}