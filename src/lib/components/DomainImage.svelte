<script lang="ts">
    import { SERVER_URL } from "$lib/costants";
    import ky from "ky";
    import { onMount } from "svelte";

    export let favicon: string | null;
    export let imageClass = "w-8 h-8 rounded-full";
    export let domain: string;

    let imageSrc: string | null = null;
    let checkDone = false;

    onMount(async () => {
        for (let path of [favicon, `${domain}.ico`, `${domain}.png`]) {
            if (!path) continue;

            try {
                path = `${SERVER_URL}/data/favicons/${path}`;
                await ky.get(path);
                imageSrc = path;
                break;
            } catch (err) {
                // pass
            }
        }

        checkDone = true;
        if (!imageSrc) imageSrc = "/img/ios-globe-4.svg";
    });
</script>

{#if checkDone}
    <img
        class={imageClass}
        src={imageSrc}
        alt="{favicon} favicon logo"
        on:error={(e) => {
            e.target.src = "/img/ios-globe-4.svg";
        }}
    />
{:else}
    <!-- svelte-ignore a11y-missing-attribute -->
    <img class={imageClass} src="/img/ios-globe-4.svg" />
{/if}
