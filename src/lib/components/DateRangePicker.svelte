<script lang="ts">
    import dayjs from "dayjs";
    import { createEventDispatcher } from "svelte";
    import { Button } from 'flowbite-svelte';
    import { MIN_CF_DATE } from "$lib/costants";


    export let min: string = MIN_CF_DATE;
    export let max: string = dayjs().format("YYYY-MM-DD");

    export let fromInit: string | undefined = undefined;
    export let toInit: string | undefined = undefined;

    const dispatch = createEventDispatcher();

    let fromDate: string = fromInit || dayjs().format("YYYY-MM-DD");
    let toDate: string = toInit || dayjs().format("YYYY-MM-DD");

    $: {
        if (fromDate || toDate) {
            dispatch("change", { fromDate, toDate });
        }
    }
</script>

<div class="flex flex-col md:flex-row items-center gap-3">
    <input class="w-72 md:w-fit border rounded" type="date" name="from" bind:value={fromDate} {min} {max} />
    <span> - </span>
    <input class="w-72 md:w-fit border rounded" type="date" name="to" bind:value={toDate} min={fromDate} {max} />
    <Button on:click={() => dispatch('apply', { fromDate, toDate })}>Apply</Button>
</div>
