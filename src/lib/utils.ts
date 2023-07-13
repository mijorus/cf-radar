import ky from "ky";
import { SERVER_URL } from "./costants";

export async function loadData(objectName: string): Promise<any> {

    let obj = sessionStorage.getItem(objectName);
    if (!obj) {
        obj = await ky.get(`${SERVER_URL}/cf-montly-data/${objectName}.json`).text();
        sessionStorage.setItem(objectName, obj);
    }

    return JSON.parse(obj);
}   