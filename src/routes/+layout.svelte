<script>
  import "../app.postcss";
  import NavBar from "../NavBar.svelte";
</script>

<NavBar />
<div class="container mx-auto py-10">
    <slot />
</div>
