<script>
  import PocketBase from "pocketbase";
  import { push } from "svelte-spa-router";
  import { PocketBase_URL } from "../utils/api/index";
  import { currentUserEmail } from "../store.js";


  // 实例化 PocketBase
  const pb = new PocketBase(PocketBase_URL);

  let channelNameInput = ""; // 用于存储用户输入的频道名称
  let searchResults = []; // 存储搜索结果的数组
  let errorMessage = ""; // 存储错误信息

  // 搜索频道的函数
  async function searchChannel() {
    try {
      errorMessage = "";
      const userEmail = $currentUserEmail;
      const records = await pb
        .collection("channels")
        .getFullList({ filter: `channelName="${channelNameInput}"` });
      searchResults = await Promise.all(
        records.map((channel) =>
          checkUserJoinedChannel(channel.channelName, userEmail).then(
            (isJoined) => ({ ...channel, isJoined }),
          ),
        ),
      );

      if (records.length === 0) {
        errorMessage = "没有找到相关频道。";
      }
    } catch (error) {
      console.error("搜索频道时发生错误：", error);
      errorMessage = "搜索频道时发生错误：" + error.message;
    }
  }

  // 检查用户是否加入了频道
  async function checkUserJoinedChannel(channelName, userEmail) {
    try {
      const records = await pb.collection("users_channels").getFullList({
        filter: `useremail="${userEmail}" && channelname="${channelName}"`,
      });
      return records.length > 0;
    } catch (error) {
      console.error("检查用户频道时发生错误：", error);
      return false;
    }
  }

  // 用户加入频道
  async function joinChannel(channelname) {
    try {
      const userEmail = $currentUserEmail;
      await pb.collection("users_channels").create({
        useremail: userEmail,
        channelname: channelname,
      });
      alert("已成功加入频道");
    } catch (error) {
      console.error("加入频道时发生错误：", error);
      alert("加入频道时发生错误：" + error.message);
    }
  }

  // 导航到频道详情页
  function navigateToChannelDetail(channelName) {
    push(`/channelDetail/${channelName}`);
  }

  // 处理 Enter 键触发的搜索
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
    bind:value={channelNameInput}
    on:keypress={handleKeyPress}
  />
  <button on:click={searchChannel}>搜索</button>
</div>

{#if errorMessage}
  <p class="error-message">{errorMessage}</p>
{:else if searchResults.length > 0}
  {#each searchResults as channel}
    <li>
      <strong>{channel.channelName}</strong> - {channel.channelDescription}
      {#if channel.isJoined}
        <span>已加入</span>
      {:else}
        <button on:click={() => joinChannel(channel.channelName)}
          >加入频道</button
        >
      {/if}
      <button on:click={() => navigateToChannelDetail(channel.channelName)}
        >访问频道</button
      >
    </li>
  {/each}
{:else if channelNameInput !== ""}
  <p>没有找到相关频道。</p>
{/if}

<style>
  .search-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1rem;
    background-color: #f3f4f6;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 1rem; /* 确保元素之间有适当的间距 */
  }

  input[type="text"],
  button {
    padding: 0.8rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    outline: none; /* 移除焦点时的轮廓 */
  }

  input[type="text"] {
    font-size: 1rem;
    margin-bottom: 0.5rem; /* 减小与下一个元素的距离 */
  }

  button {
    background-color: #0056b3;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: bold;
    transition: background-color 0.3s ease; /* 平滑的背景色过渡效果 */
  }

  button:hover {
    background-color: #003d82; /* 鼠标悬停时的背景色 */
  }

  .error-message {
    color: #d32f2f;
  }
</style>
