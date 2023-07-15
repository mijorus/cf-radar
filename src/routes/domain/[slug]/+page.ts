import { loadData } from '$lib/utils.js';
import dayjs from 'dayjs';

export async function load({ params }) {
    return {
        domain: params.slug,
        currentMonthData: await loadData("cf-montly-data/" + dayjs().format("YYYY-MM"))
        // domainData: (await loadData('data/domains_data'))[params.slug]
    };
}