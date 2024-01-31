<script>
  import PocketBase from "pocketbase";
  import { push } from "svelte-spa-router";
  import { PocketBase_URL } from "../utils/api/index";

  // 实例化 PocketBase
  const pb = new PocketBase(PocketBase_URL);

  let name = ""; // 绑定到输入框的变量，用于存储用户输入的频道名称
  let searchResults = []; // 存储搜索结果的数组
  let errorMessage = ""; // 存储错误信息

  async function searchChannel() {
    try {
      errorMessage = "";
      const records = await pb
        .collection("channels")
        .getFullList({ filter: `channelName="${name}"` });
      searchResults = records;
      if (records.length === 0) {
        errorMessage = "没有找到相关频道。";
      }
    } catch (error) {
      console.error("搜索频道时发生错误：", error);
      errorMessage = "搜索频道时发生错误：" + error.message;
    }
  }

  // 导航到频道详情页
  function ToChannel(channelName) {
    push(`/channelDetail/${channelName}`);
  }

  // 按下 Enter 键时触发搜索
  function handleKeyPress(event) {
    if (event.key === "Enter") {
      searchChannel();
    }
  }
</script>

<h1>查找频道</h1>
<div class="search-container">
  <input
    type="text"
    placeholder="输入频道名称"
    bind:value={name}
    on:keypress={handleKeyPress}
  />
  <button on:click={searchChannel}>搜索</button>
</div>

{#if errorMessage}
  <p class="error-message">{errorMessage}</p>
{:else if searchResults.length > 0}
  <ul class="results-list">
    {#each searchResults as channel}
      <li>
        <strong>{channel.channelName}</strong>
        <button on:click={() => ToChannel(channel.channelName)}>访问频道</button
        >
      </li>
    {/each}
  </ul>
{:else if name !== ""}
  <p>没有找到相关频道。</p>
{/if}

<style>
  input[type="text"],
  button {
    /* 共用的输入框和按钮样式 */
    margin-bottom: 10px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: #0056b3;
  }

  .results-list {
    list-style: none;
    padding-left: 0;
  }

  .results-list li {
    margin-top: 10px;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 4px;
  }

  .error-message {
    color: red;
  }
</style>
