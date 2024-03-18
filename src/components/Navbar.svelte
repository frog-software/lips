<script>
  import { onMount, onDestroy } from "svelte";
  import { username, originChannelID, currentnoticeid } from "../store.js";
  import PocketBase from "pocketbase";
  import { push } from "svelte-spa-router";
  import { PocketBase_URL } from "../utils/api/index";
  import Searchlan from "../components/searchlan.svelte";

  const pb = new PocketBase(PocketBase_URL);
  let isOpen = false;
  let searchQuery = "";
  // let isMainPage = true;
  let errorMessage = "";
  let searchchannels = [];
  let searchnotices = [];
  let searchtags = [];
  let isFocused = false;

  function jumpnew(id) {
    originChannelID.set(id);
    push("/chantemplate");
  }
  function jumpnewnotice(id) {
    currentnoticeid.set(id);
    push("/checknotice");
  }
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
  function handleClickOutside(event) {
    if (!event.target.closest(".search")) {
      isFocused = false;
    }
  }
  function toggleDrawer() {
    isOpen = !isOpen;
  }
  // function isid() {
  //   if ($currentchannelid != null) isMainPage = false;
  // }
  // function search(){
  //   alert(isMainPage);
  // }
  async function search() {
    errorMessage = "";
    try {
      // 获取所有频道及通知记录
      const allRecords = await pb.collection("channels").getFullList();
      const allnotices = await pb.collection("notices").getFullList();
      // 根据输入过滤并限制结果数量为最多4个
      if (searchQuery.length > 0) {
        const filteredRecords = allRecords.filter((record) =>
          record.channelName.startsWith(searchQuery),
        );
        const limitedRecords = filteredRecords.slice(0, 4);
        searchchannels = limitedRecords;

        const filterednotices = allnotices.filter((record) =>
          record.tittle.startsWith(searchQuery),
        );
        const limitednotices = filterednotices.slice(0, 4);
        searchnotices = limitednotices;

        const filteredtags = allnotices.filter((record) =>
          record.tag.startsWith(searchQuery),
        );
        const limitedtags = filteredtags.slice(0, 4);
        searchtags = limitedtags;
        if (
          limitedRecords.length === 0 &&
          limitednotices.length === 0 &&
          limitedtags.length === 0
        ) {
          errorMessage = "没有找到相关频道或通知。";
        }
      } else {
        searchchannels = [];
        searchnotices = [];
      }
    } catch (error) {
      console.error("搜索频道时发生错误：", error);
      errorMessage = "搜索频道时发生错误：" + error.message;
    }
  }

  onMount(() => {
    // isid();
    document.addEventListener("click", handleClickOutside);
  });
  onDestroy(() => {
    document.removeEventListener("click", handleClickOutside);
  });
  const debouncedSearchChannel = debounce(search, 500);
</script>

<div class="navbar">
  <div class="navbar bg-base-100 rounded-3xl shadow-xl topnavbar">
    <div class="flex-none">
      <div class="drawer">
        <input
          id="my-drawer"
          type="checkbox"
          bind:checked={isOpen}
          class="drawer-toggle"
        />
        <div class="drawer-content">
          <!-- Page content here -->
          <button on:click={toggleDrawer} class="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-5 h-5 stroke-current"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path></svg
            >
          </button>
        </div>
        <div class="drawer-side">
          <label
            for="my-drawer"
            aria-label="close sidebar"
            class="drawer-overlay"
          ></label>
          <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <!-- Sidebar content here -->
            <li><a href="/#">Sidebar Item 1</a></li>
            <li><a href="/#">Sidebar Item 2</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div class="flex-1">
    <a href="/#/login" class="btn btn-ghost text-xl logo">lips</a>
  </div>

  <!-- <Searchlan  /> -->

  <div class="search">
    <input
      type="text"
      bind:value={searchQuery}
      on:input={debouncedSearchChannel}
      placeholder="search everything..."
      on:focus={() => (isFocused = true)}
    />
    <button on:click={() => search()}>search</button>
    {#if errorMessage}
      <div class="searchdrop">
        <div
          class="searchdrop-item"
          role="button"
          tabindex="0"
          on:keypress
          on:click={() => {
            isFocused = false;
          }}
        >
          <p>{errorMessage}</p>
        </div>
      </div>
    {:else if isFocused && (searchchannels.length > 0 || searchnotices.length > 0 || searchtags.length > 0) && searchQuery !== ""}
      <div class="searchdrop">
        {#each searchchannels as channel}
          <div
            class="searchdrop-item"
            role="button"
            tabindex="0"
            on:keypress
            on:click={() => jumpnew(channel.id)}
          >
            <div class="channame">
              <strong>{channel.channelName}</strong>
              <p class="droptag">频道</p>
            </div>
            <p>{channel.channelDescription}</p>
          </div>
        {/each}
        {#each searchnotices as notice}
          <div
            class="searchdrop-item"
            role="button"
            tabindex="0"
            on:keypress
            on:click={() => jumpnewnotice(notice.id)}
          >
            <div class="channame">
              <strong>{notice.tittle}</strong>
              <p class="droptag">通知</p>
            </div>
            <p>#{notice.tag} 作者:{notice.username}</p>
          </div>
        {/each}
        {#each searchtags as notice}
          <div
            class="searchdrop-item"
            role="button"
            tabindex="0"
            on:keypress
            on:click={() => jumpnewnotice(notice.id)}
          >
            <div class="channame">
              <strong>{notice.tittle}</strong>
              <p class="droptag">通知</p>
            </div>
            <p>#{notice.tag} 作者:{notice.username}</p>
          </div>
        {/each}
      </div>
    {:else if isFocused && searchQuery !== ""}
      <div class="searchdrop">
        <div
          class="searchdrop-item"
          role="button"
          tabindex="0"
          on:keypress
          on:click={() => {
            isFocused = false;
          }}
        >
          <p>无法显示相关频道或通知。</p>
        </div>
      </div>
    {/if}
  </div>

  <div class="flex-none">
    <div class="dropdown dropdown-end">
      <div
        class="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
      >
        <div class="card-body">
          <span class="font-bold text-lg">8 Items</span>
          <span class="text-info">Subtotal: $999</span>
          <div class="card-actions">
            <button class="btn btn-primary btn-block">View cart</button>
          </div>
        </div>
      </div>
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img alt="Tailwind CSS Navbar component" src="userPicture.jpeg" />
            <!-- <img alt="Tailwind CSS Navbar component" src="selectTagsPicture.jpg" /> -->
          </div>
        </div>
        <ul
          class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <a class="justify-between btn-disabled text-black" href="/"
              >{$username}</a
            >
          </li>
          <li><a href="/#/main1">Profile</a></li>
          <li><a href="/#/myChannels">Mychannels</a></li>
          <li><a href="/#/login">Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</div>

<div class="navbar"></div>

<style>
  .search {
    margin-right: 20%;
    position: relative;
  }
  input[type="text"] {
    width: 400px;
    padding: 8px;
    font-size: 16px;
    border: 2px solid #ddd;
    border-radius: 16px;
    outline: none;
    transition: border-color 0.3s;
  }
  input[type="text"]:focus {
    width: 400px;
    border-color: #007bff;
  }
  button {
    padding: 8px 15px;
    font-size: 16px;
    background-color: #c8c8c8;
    color: white;
    border: none;
    border-radius: 16px;
    cursor: pointer;
    margin-left: 10px;
    outline: none;
  }
  button:hover {
    background-color: #0056b3;
  }
  .channame {
    display: flex; /* 启用Flexbox布局 */
    align-items: center; /* 垂直居中 */
    gap: 10px; /* 在项目之间添加一些间隔 */
  }
  .droptag {
    color: #fff;
    background-color: #7d7d7d;
    width: 10%;
    text-align: center;
    font-size: small;
  }
  .searchdrop {
    position: absolute;
    top: 100%;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 400px; /* 根据输入框宽度调整 */
    max-height: 200px;
    overflow-y: auto;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    margin-top: 2px;
  }
  .searchdrop-item {
    padding: 10px;
    cursor: pointer;
    text-align: left;
  }
  .searchdrop-item:hover {
    background-color: #f5f5f5;
  }
</style>
