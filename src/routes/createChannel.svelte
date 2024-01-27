<script>
  import { push } from "svelte-spa-router";
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";

  const pb = new PocketBase(PocketBase_URL);
  let channelName = "";
  let channelDescription = "";

  async function handleCreate() {
    // 检查频道名是否已存在
    const existingChannels = await pb.collection("channels").getFullList({filter: `channelName = "${channelName}"`});
    if (existingChannels.length > 0) {
      alert("A channel with this name already exists. Please choose a different name.");
      return;
    }

    const data = {
      channelName: channelName,
      description: channelDescription, // 添加频道简介
    };

    try {
      const createdChannel = await pb.collection("channels").create(data);
      console.log("Created channel ID:", createdChannel.id); // 打印新创建的频道ID
      push("/main"); // 创建成功后跳转到主界面
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
    <div class="item-box">
      <textarea bind:value={channelDescription} placeholder="Channel Description"></textarea>
    </div>
  </div>
  <button type="submit">Create Channel</button>
</form>
