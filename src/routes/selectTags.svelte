<script>
  import { onMount } from "svelte";
  import { PocketBase_URL } from "../utils/api/index";
  import PocketBase from "pocketbase";

  const pb = new PocketBase(PocketBase_URL);
  let records = [];
  let selectrecord = [];
  let setag = "";

  async function xianshi() {
    try {
      const response = await pb.collection("notices").getFullList({
        sort: "-created",
      });
      records = response;
    } catch (error) {
      alert("fail to find");
    }
  }
  onMount(() => {
    xianshi();
  });

  async function select() {
    try {
      const result = await pb.collection("notices").getFullList({
        filter: `tag="${setag}"`,
      });
      if (result.length === 0) {
        alert("fail to select");
        selectrecord = [];
      } else {
        selectrecord = result;
      }
    } catch (error) {
      alert("fail to select");
    }
  }
</script>

<h1>select tags</h1>

<h2>tags recommended:</h2>
{#each records as record}
  <div class="container">
    <p>#{record.tag}</p>
  </div>
{/each}

<form on:submit|preventDefault={select}>
  <div>
    <label for="tittle">select a tag</label>
    <input
      type="text"
      id="setag"
      bind:value={setag}
      placeholder="An interesting tag"
    />
  </div>
  <div>
    <button type="submit">search</button>
  </div>
</form>
{#each selectrecord as record}
  <div>
    <p>tittle: {record.tittle}</p>
    <p>body: {record.body}</p>
    <p>release_time: {record.release_time}</p>
  </div>
{/each}

<style>
  .container {
    display: inline-block;
    padding: 10px; /* 内边距 */
  }
</style>
