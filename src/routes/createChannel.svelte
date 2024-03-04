<script>
  import { push } from "svelte-spa-router";
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";

  const pb = new PocketBase(PocketBase_URL);
  let channelName = "";
  let channelDescription = "";
  let isLoading = false; // 新增：用于跟踪提交状态

  async function handleCreate() {
    isLoading = true;

    // 检查频道名是否已存在
    const existingChannels = await pb
      .collection("channels")
      .getFullList({ filter: `channelName = "${channelName}"` });
    if (existingChannels.length > 0) {
      alert(
        "A channel with this name already exists. Please choose a different name.",
      );
      isLoading = false;
      return;
    }

    const data = {
      channelName: channelName,
      channelDescription: channelDescription,
    };

    try {
      await pb.collection("channels").create(data);
      alert("Channel created successfully");
      isLoading = false;
      push("/main");
    } catch (error) {
      alert("ERROR: " + error.message);
      isLoading = false;
    }
  }
</script>

<h1>Create Your Channel</h1>

<form on:submit|preventDefault={handleCreate} class="channel-form">
  <div class="form-group">
    <input
      type="text"
      bind:value={channelName}
      placeholder="Channel Name"
      class="form1-control"
    />
  </div>
  <div class="form-group">
    <textarea
      bind:value={channelDescription}
      placeholder="Channel Description"
      class="form-control"
    ></textarea>
  </div>
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <button type="submit" class="btn-submit">Create Channel</button>
  {/if}
</form>

<style>
  .channel-form {
    max-width: 500px;
    margin: auto;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 15px;
  }
  .form1-control {
    max-width: 500px;
    max-height: 200px;
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .form-control {
    max-width: 500px;
    max-height: 200px;
    min-width: 300px;
    min-height: 100px;
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .btn-submit {
    margin: auto;
    width: 100%;
    padding: 10px;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .btn-submit:hover {
    background-color: #0056b3;
  }
</style>
