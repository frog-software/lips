<script>
  import PocketBase from "pocketbase";
  import { push } from "svelte-spa-router";
  import { PocketBase_URL } from "../utils/api/index";
  import { currentUserEmail, originChannelID } from "../store.js";

  const pb = new PocketBase(PocketBase_URL);

  let channelNameInput = ""; // 存储用户输入的频道名称
  let searchResults = []; // 存储搜索到的频道结果数组
  let errorMessage = ""; // 存储可能出现的错误信息

  // 定义防抖函数，用于优化搜索性能
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 执行频道搜索的异步函数
  async function searchChannel() {
    try {
      errorMessage = "";
      const userEmail = $currentUserEmail; // 从响应式存储中获取当前用户邮箱

      // 获取所有频道记录
      const allRecords = await pb.collection("channels").getFullList();

      // 根据输入过滤并限制结果数量为最多4个
      const filteredRecords = allRecords.filter((record) =>
        record.channelName.startsWith(channelNameInput),
      );
      const limitedRecords = filteredRecords.slice(0, 4);

      // 检查每个频道是否被当前用户加入，并更新搜索结果
      let tempSearchResults = [];
      for (let channel of limitedRecords) {
        const isJoined = await checkUserJoinedChannel(
          channel.channelName,
          userEmail,
        ).catch(() => false);
        tempSearchResults.push({ ...channel, isJoined });
      }
      searchResults = tempSearchResults;

      if (limitedRecords.length === 0) {
        errorMessage = "没有找到相关频道。";
      }
    } catch (error) {
      console.error("搜索频道时发生错误：", error);
      errorMessage = "搜索频道时发生错误：" + error.message;
    }
  }

  // 检查用户是否已加入指定频道的异步函数
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

  // 用户加入频道并导航到频道详情页的异步函数
  async function joinChannel(channelname) {
    try {
      const userEmail = $currentUserEmail;
      await pb.collection("users_channels").create({
        useremail: userEmail,
        channelname: channelname,
      });
      alert("已成功加入频道");
      navigateToChannelDetail("main");
    } catch (error) {
      console.error("加入频道时发生错误：", error);
      alert("加入频道时发生错误：" + error.message);
    }
  }

  async function updateOriginChannelId(cN){
    try{
      const response_ = await pb.collection("channels").getFullList({
        sort: "-created",
        filter: `channelName="${cN}"`,
      });
      originChannelID.set(response_[0].id);
      originChannelID.set(response_[0].id);

    }catch{
        alert("error");
    }
  }
  // 导航到指定频道详情页的函数
  function navigateToChannelDetail(channelName) {
    push("/" + channelName);
  }

  // 应用防抖函数到搜索频道函数，以优化性能
  const debouncedSearchChannel = debounce(searchChannel, 500);

</script>

<h1>查找频道</h1>

<div class="search-container">
  <input
    type="text"
    class="search-input"
    placeholder="输入频道名称"
    bind:value={channelNameInput}
    on:input={debouncedSearchChannel}
  />
  <button class="search-btn" on:click={searchChannel}>搜索</button>
</div>

{#if errorMessage}
  <p class="error-message">{errorMessage}</p>
{:else if searchResults.length > 0}
  <ul class="search-results">
    {#each searchResults as channel}
      <li class="search-result-item">
        <div class="channel-info">
          <strong>{channel.channelName}</strong> - {channel.channelDescription}
        </div>
        <div class="channel-actions">
          {#if channel.isJoined}
            <span>已加入</span>
          {:else}
            <button
              class="join-btn"
              on:click={() => joinChannel(channel.channelName)}>加入频道</button
            >
          {/if}
          <button
            class="detail-btn"
            on:click={() => navigateToChannelDetail("chantemplate")}
            on:click={() => updateOriginChannelId(channel.channelName)}
            >访问频道</button
          >
        </div>
      </li>
    {/each}
  </ul>
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
    gap: 10px; /* 减少空间，更紧凑的布局 */
  }

  .search-input,
  .search-btn,
  .join-btn,
  .detail-btn {
    padding: 0.8rem;
    border-radius: 6px;
    border: 1px solid #ccc;
    outline: none;
    font-size: 1rem;
  }

  .search-input {
    flex-grow: 1; /* 输入框占据更多空间 */
  }

  .search-btn,
  .join-btn,
  .detail-btn {
    background-color: #007bff;
    color: white;
    cursor: pointer;
    border: none;
  }

  .search-btn:hover,
  .join-btn:hover,
  .detail-btn:hover {
    background-color: #0056b3;
  }

  .search-results {
    list-style: none;
    padding: 0;
  }

  .search-result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .channel-info {
    max-width: 70%; /* 确保文本不会占满整行 */
  }

  .channel-actions {
    display: flex;
    gap: 10px;
  }

  .error-message {
    color: #d32f2f;
    text-align: center;
  }
</style>
