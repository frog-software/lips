<script>
  import PocketBase from "pocketbase";
  import { push } from "svelte-spa-router";
  import { PocketBase_URL } from "../utils/api/index";
  import { currentUserEmail, originChannelID } from "../store.js";
  import { onMount } from "svelte";
  let tittle = "";
  let body = "";
  let tag = "";
  let name = "";
  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth() + 1; //从0开始
  let currentDate = new Date().getDate();
  const pb = new PocketBase(PocketBase_URL);

  function cancel() {
    push("/main");
  }
  async function getname() {
    try {
      const currentemail = $currentUserEmail;
      const response = await pb.collection("users").getFullList({
        sort: "-created",
        filter: `email="${currentemail}"`,
      });
      name = response[0].username;
    } catch (error) {
      alert("fail to find");
    }
  }
  async function post() {
    //异步函数的定义
    const userEmail = $currentUserEmail;
    const channelid = $originChannelID;
    const data = {
      tittle: tittle,
      body: body,
      tag: tag,
      year: currentYear,
      month: currentMonth,
      day: currentDate,
      useremail: userEmail,
      channelid: channelid,
      username: name,
    };
    try {
      await pb.collection("notices").create(data);
      push("/main");
    } catch (error) {
      alert("fail to post");
    }
  }

  const years = Array.from({ length: currentYear - 1999 }, (_, i) => 2000 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  let days;

  $: days = getDaysInMonth(currentYear, currentMonth);

  function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }
  onMount(() => {
    getname();
  });
</script>

<h1>发布你的第一条通知吧！</h1>

<form on:submit|preventDefault={post}>
  <div>
    <label for="tittle">Tittle:</label>
    <input type="text" id="tittle" bind:value={tittle} placeholder="Tittle" />
  </div>
  <div>
    <label for="body">Body:</label>
    <textarea id="body" name="body" bind:value={body} placeholder="Body"
    ></textarea>
  </div>
  <div>
    <label for="tag">Tag:</label>
    <input
      type="text"
      id="tag"
      bind:value={tag}
      placeholder="An interesting tag"
    />
  </div>
  <div>
    <label for="release_time">Release_time:</label>
    <div class="time">
      <select bind:value={currentYear}>
        {#each years as year}
          <option value={year}>{year}年</option>
        {/each}
      </select>
      <select bind:value={currentMonth}>
        {#each months as month}
          <option value={month}>{month}月</option>
        {/each}
      </select>
      <select bind:value={currentDate}>
        {#each Array.from({ length: days }, (_, i) => i + 1) as day}
          <option value={day}>{day}日</option>
        {/each}
      </select>
    </div>
  </div>
  <div>
    <button type="submit" class="btn btn-primary w-1/6 text-lg"> 发布 </button>
  </div>
</form>

<button on:click={cancel} class="btn btn-primary w-1/6 text-lg"> 取消 </button>

<style>
  div {
    margin-bottom: 10px;
  }

  label {
    display: block;
    font-weight: bold; /*文本粗细*/
    margin-bottom: 5px; /* div元素之间的距离 */
    width: 20%;
    margin-left: 10%;
  }

  input[type="text"] {
    width: 20%;
    height: 40px;
    border: 1px solid #ccc; /* 边框 */
    padding: 10px; /* 内边距 */
    border-radius: 5px; /* 圆角 */
    float: left;
    margin-left: 20%;
  }

  textarea {
    width: 60%;
    height: 400px;
    padding: 10px; /* 内边距 */
    font-weight: bold; /*文本粗细*/
    border: 1px solid #ccc; /* 边框 */
    border-radius: 5px; /* 圆角 */
  }
  .time {
    width: 55%;
  }
</style>
