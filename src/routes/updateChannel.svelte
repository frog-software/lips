<script>
  import { push } from "svelte-spa-router";
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import { currentchannelName } from "../store.js";
  import { onMount } from "svelte";
  const pb = new PocketBase(PocketBase_URL);
  let isLoading = false;
  let records = "";
  let description = "";
  let channelId = "";

  async function checkchan() {
    try {
      const channel = $currentchannelName;

      const response = await pb.collection("channels").getFullList({
        sort: "-created",
        filter: `channelName="${channel}"`,
      });
      records = response[0].channelName;
      description = response[0].channelDescription;
      channelId = response[0].id;
    } catch (error) {
      alert("fail to fixnd");
    }
  }
  onMount(() => {
    checkchan();
  });

  async function SaveChanges() {
    isLoading = true;
    if (channelId) {
      // 如果channelId存在，则更新频道
      const data = {
        channelName: records,
        channelDescription: description,
      };

      try {
        await pb.collection("channels").update(channelId, data);
        alert("Channel updated successfully");
        isLoading = false;
        push("/main");
      } catch (error) {
        alert("ERROR: " + error.message);
        isLoading = false;
      }
    } else {
      // 如果channelId不存在，可以选择创建新频道或者显示错误消息
      alert("Channel does not exist.");
      isLoading = false;
    }
  }
</script>

<h1>Update Your Channel</h1>
<!-- <h1>{records.channelName }</h1> -->
<!-- {#each records as record}{record.channelName}{/each} -->
<form on:submit|preventDefault={SaveChanges} class="channel-form">
  <div class="form-group">
    <input
      type="text"
      bind:value={records}
      placeholder="Channel Name"
      class="form1-control"
    />
  </div>
  <div class="form1-group">
    <textarea
      bind:value={description}
      placeholder="Channel Description"
      class="form-control"
    ></textarea>
  </div>
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <button type="submit" class="btn-submit">Save Changes</button>
  {/if}
</form>

<style>
  h1 {
    text-align: center;
  }
  .channel-form {
    width: 100vw;
    height: 100vh;
    margin: auto;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    margin-bottom: 15px;
    height: 10%;
    width: 100%;
  }
  .form1-group {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    position: relative; /* 确保父容器有相对定位 */
    margin-bottom: 15px;
    height: 60%;
    width: 100%;
  }
  .form1-control {
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
    /* max-width: 500px;
    max-height: 200px; */
    width: 70%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }
  .form-control {
    /* max-width: 500px;
      max-height: 500px;
      min-width: 500px;
      min-height: 300px; */
    width: 80%;
    height: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
    position: absolute;
    top: 0; /* 置顶显示 */
  }

  .btn-submit {
    margin: auto;
    width: 50%;
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
