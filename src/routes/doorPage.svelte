<script>
  import { push, location } from "svelte-spa-router";
  import { onDestroy } from "svelte";

  function handleLogin() {
    push("/login");
  }
  let currentpath = "";

  const unsubscribe = location.subscribe(($location) => {
    currentpath = $location;
  });
  onDestroy(unsubscribe);
</script>

<h1>Welcome to lips</h1>

{#if currentpath == "/"}
  <button on:click={handleLogin}> Log in </button>
{/if}
