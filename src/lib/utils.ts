import ky from "ky";
import { SERVER_URL } from "./costants";
import { browser } from "$app/environment";

export async function loadData(objectName: string): Promise<any> {
    console.log('Loading ' + `${SERVER_URL}/${objectName}.json`);

    let obj = undefined;
    let cache = undefined;
    if (browser && sessionStorage.getItem('dataCache')) {
        cache = JSON.parse((sessionStorage.getItem('dataCache') || '{}'));
        obj = cache[objectName];
    }

    if (!obj) {
        obj = await ky.get(`${SERVER_URL}/${objectName}.json`).json();
        if (browser) {
            try {
                cache[objectName] = obj;
                sessionStorage.setItem('dataCache', JSON.stringify(cache));
            } catch (e) {
                sessionStorage.removeItem('dataCache');
            }
        }
    }

    // console.log(obj)
    return obj;
}

export function getRandomId() {
    return (Math.random() + 1).toString(36).substring(7);
}

export function addQueryParam(key: string, value: any): string {
    if (!window) {
        return;
    }

    // Get current URL parts
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash;

    // Update query string values
    params.set(key, value);

    // Encode URL
    console.log(params.toString());

    // Update URL
    return `${path}?${params.toString()}${hash}`;
}

export function clone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}