<script lang="ts">
    import DomainImage from "$lib/components/DomainImage.svelte";
import { Heading } from "flowbite-svelte";

    interface DomainData { domainsData: DomainDataReponse, domain: string }

    export let data: DomainData;

    $: loadPage(data);

    function loadPage(data: DomainData) {
        if (data?.domainsData[data.domain]) {

        }
    }
</script>

<Heading tag="h1" class="mb-4" customSize="flex flex-row items-end gap-3 text-4xl font-extrabold md:text-5xl lg:text-6xl">
    <DomainImage favicon={data.domainsData[data.domain].favicon } imageClass="w-8 h-8 md:w-12 md:h-12 rounded-full"/>
    <span>
        {data.domain}
    </span>
</Heading>
