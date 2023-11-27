<script>
  import { push } from "svelte-spa-router";
  import PocketBase from "pocketbase";

  const pb = new PocketBase("http://127.0.0.1:8090");
  let channelName = "";

  async function handleCreate() {
    const data = {
      channelName: channelName,
    };
    try {
      await pb.collection("channels").create(data);
      push("/yourChannel");
    } catch (error) {
      alert("ERROR: " + error.message);
    }
  }
</script>

<h1>Create your channel</h1>

<form on:submit|preventDefault={handleCreate}>
  <div class="content-box">
    <div class="item-box">
      <input type="text" bind:value={channelName} placeholder="Channel Name" />
    </div>
  </div>
  <button type="submit">Create Channel</button>
</form>
