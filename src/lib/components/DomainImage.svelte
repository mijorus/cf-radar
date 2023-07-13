<script lang="ts">
    import { SERVER_URL } from "$lib/costants";

    export let favicon: string | null;
    export let imageClass = "w-8 h-8 rounded-full";
</script>

{#if favicon}
    <img
        class={imageClass}
        src="{SERVER_URL}/data/favicons/{favicon}"
        alt="{favicon} favicon logo"
        on:error={(e) => {
            e.target.src = "/img/ios-globe-4.svg";
        }}
    />
{:else}
    <!-- svelte-ignore a11y-missing-attribute -->
    <img class={imageClass} src="/img/ios-globe-4.svg" />
{/if}
