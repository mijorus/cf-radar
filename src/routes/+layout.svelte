<script lang="ts">
    import ky from "ky";
    import "../app.postcss";
    import NavBar from "../NavBar.svelte";
    import { SERVER_URL } from "$lib/costants";
    import { writable, type Writable } from "svelte/store";
    import { onMount, setContext } from "svelte";

    const domainsData: Writable<DomainDataReponse> = writable();
    setContext("domainsData", domainsData);

    onMount(async () => {
        const res = await ky.get(`${SERVER_URL}/data/domains_data.json`).json();
        console.log('reloading');

        domainsData.set(res);
    });
</script>

<NavBar />
<div class="container mx-auto py-10">
    <slot />
</div>
