import ky from "ky";
import { SERVER_URL } from "./costants";
import { browser } from "$app/environment";

export async function loadData(objectName: string): Promise<any> {

    let obj = browser ? sessionStorage.getItem(objectName) : undefined;
    if (!obj) {
        obj = await ky.get(`${SERVER_URL}/${objectName}.json`).text();
        if (browser) {
            try {
                sessionStorage.setItem(objectName, obj);
            } catch (e) {
                sessionStorage.clear();
            }
        }
    }

    return JSON.parse(obj);
}

export function getRandomId() {
    return (Math.random() + 1).toString(36).substring(7);
}

export function addQueryParam(key: string, value: any) {
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
    window.history.replaceState({}, '', `${path}?${params.toString()}${hash}`);
}

export function clone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}