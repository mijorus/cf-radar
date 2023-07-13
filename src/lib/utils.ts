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