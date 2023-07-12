<script lang="ts">
    import dayjs from "dayjs";
    import { createEventDispatcher } from "svelte";
    import { Button } from 'flowbite-svelte';


    export let min: string;
    export let max: string = dayjs().format("YYYY-MM-DD");

    export let fromInit: string | undefined = undefined;
    export let toInit: string | undefined = undefined;

    const dispatch = createEventDispatcher();

    let fromDate = fromInit || dayjs().format("YYYY-MM-DD");
    let toDate = toInit || dayjs().format("YYYY-MM-DD");

    $: {
        if (fromDate || toDate) {
            dispatch("change", { fromDate, toDate });
        }
    }
</script>

<div class="flex flex-row items-center gap-3 ">
    <input class="border rounded" type="date" name="from" bind:value={fromDate} {min} {max} />
    <span> - </span>
    <input class="border rounded" type="date" name="to" bind:value={toDate} min={fromDate} {max} />
    <Button on:click={() => dispatch('apply', { fromDate, toDate })}>Apply</Button>
</div>
