<!-- <script>
  import { onMount } from "svelte";
  import { PocketBase_URL } from "../utils/api/index";
  import PocketBase from "pocketbase";
  import { currentUserEmail } from "../store.js";

  const pb = new PocketBase(PocketBase_URL);
  let records = [];
  let selectrecord = [];
  let setag = "";
  let checktittle = [];
  async function xianshi() {
    try {
      const response = await pb.collection("notices").getList(1, 3, {
        sort: "-created",
      });
      records = response.items;
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

  async function check(checktag) {
    records = [];
    selectrecord = [];
    try {
      const result1 = await pb.collection("notices").getFullList({
        filter: `tittle="${checktag}"`,
      });
      if (result1.length === 0) {
        alert("fail to select");
        checktittle = [];
      } else {
        checktittle = result1;
      }
    } catch (error) {
      alert("fail to check");
    }
  }

  function update() {
    checktittle = [];
  }

  async function copy(check) {
    try {
      const userEmail = $currentUserEmail;
      const newRecord = {
        tittle: check.tittle,
        body: check.body,
        tag: check.tag,
        year: check.year,
        month: check.month,
        day: check.day,
        useremail: userEmail,
        noticeid: check.id,
        username: check.username,
      };
      await pb.collection("todolist").create(newRecord);
      alert("添加成功！");
      location.reload();
    } catch (error) {
      alert("添加失败。");
    }
  }
</script>

<h1>select tags</h1>

<form on:submit|preventDefault={select}>
  <div>
    <label for="tittle">select a tag</label>
    <input
      type="text"
      id="setag"
      bind:value={setag}
      placeholder="An interesting tag"
    />
    <button type="submit" on:click={update}>search</button>
  </div>
</form>

{#each records as record}
  <div class="container">
    <p>#{record.tag}</p>
  </div>
{/each}

{#each selectrecord as record}
  <ul class="results-list">
    <li>
      <p>
        #{record.tag} 《{record.tittle}》 {record.year}年{record.month}月{record.day}日
      </p>
      <button on:click={() => check(record.tittle)}>check</button>
    </li>
  </ul>
{/each}

{#each checktittle as check}
  <div class="check">
    <p>{check.tittle}</p>
    <p>{check.body}</p>
    <p>{check.year}年{check.month}月{check.day}日</p>
    <button on:click={() => copy(check)}>+ todolist</button>
  </div>
{/each}

<style>
  .container {
    display: inline-block;
    padding: 10px; /* 内边距 */
  }

  button {
    background-color: #007bff;
    color: white;
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

  .check {
    background-color: #f8f9fa;
    border-radius: 4px;
  }
</style> -->

<!-- 频道模板 可发送通知 显示频道已有的通知-->
<script>
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  import {
    currentnoticeid,
    selectedtag,
    isJoinedTodo,
    currentUserEmail,
    channelName,
  } from "../store.js";
  import { push } from "svelte-spa-router";
  import { onMount } from "svelte";
  import Navbar from "../components/Navbar.svelte";
  import { writable } from "svelte/store";

  const pb = new PocketBase(PocketBase_URL);
  let records = [];
  let tags = [];
  async function noticedisplay() {
    try {
      const tagi = $selectedtag;
      const responses = await pb.collection("notices").getFullList({
        sort: "-created",
        filter: `tag="${tagi}"`,
      });
      const names = responses.map((response) => response.tag);
      tags = [...new Set(names)];
      records = responses;
    } catch (error) {
      alert("fail to find");
    }
  }

  let isJoin = writable(false);
  async function checkIsjoin() {
    const email = $currentUserEmail;
    const responses = await pb.collection("users_channels").getFullList({
      sort: "-created",
      filter: `useremail="${email}"`,
    });
    for (const item of responses) {
      if (item.channelname == $channelName) {
        isJoin.set(true);
        break;
      }
    }
  }

  onMount(() => {
    noticedisplay();
    getorId();
    checkIsjoin();

    // const params = new URLSearchParams(window.location.search);
    // alert(params);
    // value = params.get('value');
  });

  function send() {
    push("/postnotice");
  }

  async function check(id, title) {
    currentnoticeid.set(id);
    const uEmail = $currentUserEmail;
    const response = await pb.collection("todolist").getFullList({
      sort: "-created",
      filter: `useremail="${uEmail}"`,
    });

    for (const item of response) {
      if (item.tittle == title) {
        isJoinedTodo.set("find");
        break;
      } else {
        isJoinedTodo.set("noFind");
      }
    }
    push("/checknotice");
  }

  let cId = "";
  async function getorId() {
    const name = $channelName;
    const response = await pb.collection("channels").getFullList({
      sort: "-created",
      filter: `channelName="${name}"`,
    });
    //alert(response[0].id);
    cId = response[0].id;
    //alert(cId)
  }

  function origin(tagname) {
    selectedtag.set(tagname);
  }

  async function joinChannel(channelname, channelid) {
    isJoin.set(true);
    try {
      const userEmail = $currentUserEmail;
      // 获取当前日期
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // JavaScript的月份是从0开始的
      const day = now.getDate();

      // 以备选方式获取频道描述
      const records = await pb
        .collection("channels")
        .getFullList({ filter: `channelName="${channelname}"` });
      if (records.length === 0) {
        throw new Error("未找到指定的频道。");
      }
      const channelDescription = records[0].channelDescription;

      // 创建记录并包含年月日和频道描述
      await pb.collection("users_channels").create({
        useremail: userEmail,
        channelname: channelname,
        originid: channelid,
        year: year,
        month: month,
        day: day,
        channelDescription: channelDescription, // 存储频道描述
      });

      alert("已成功加入频道");
      //navigateToChannelDetail("main");
    } catch (error) {
      console.error("加入频道时发生错误：", error);
      alert("加入频道时发生错误：" + error.message);
    }
  }
</script>

<Navbar />

<div class="father">
  <div class="all">
    <div class="container">
      <div class="left">
        {#each records as record}
          <div
            class="record"
            role="button"
            tabindex="0"
            on:click={() => check(record.id, record.tittle)}
            on:keypress
          >
            <a href="#/checknotice" class="title">{record.tittle}</a>
            <div class="author">#{record.tag} from:{record.username}</div>
            <div class="content">
              {record.body.length > 10
                ? `${record.body.substring(0, 10)}...`
                : record.body}
            </div>
          </div>
        {/each}
      </div>

      <div class="right">
        <div class="image-container">
          <img alt="user" src="channel.jpg" />
        </div>
        <div class="text-container">
          <div style="font-size: larger;">{$channelName}</div>
          {#if $isJoin == false}
            <button
              class="join"
              on:click={() => joinChannel($channelName, cId)}
            >
              订阅</button
            >
          {:else}
            <button on:click={send} class="join">发送通知</button>
          {/if}
        </div>
        <div class="tagi">
          <div class="tagTitle">Tags</div>
          {#each tags as tag}
            <a href="#/jumptag" class="tag" on:click={() => origin(tag)}
              >{tag}</a
            >
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .tagi {
    border-top: 5px solid #666966; /* 设置上边框颜色和粗细 */
  }
  .tagTitle {
    color: black;
    font-size: xx-large;
  }
  .image-container {
    height: 30%; /* 设置为 .right 容器高度的 30% */
    display: flex; /* 使得内容居中（如果需要） */
    align-items: center;
    justify-content: center;
  }
  .image-container img {
    width: 100%; /* 使图片宽度填满容器 */
    height: 100%; /* 可选，视图片的实际显示效果而定 */
    object-fit: cover; /* 调整这个值为 cover, contain, fill 等，根据需要选择 */
    /* border: 2px solid #b0aeae; 明显的边框，可以根据需要调整颜色和宽度 */
    border-radius: 50%; /* 这将使图像的边角变圆，形成圆形 */
    object-fit: cover; /* 确保图像在调整大小时保持其宽高比 */
  }
  .text-container {
    display: flex; /* 将容器设置为flex布局 */
    flex-direction: column; /* 设置子元素垂直排列 */
    justify-content: center; /* 垂直居中 */
    align-items: center; /* 水平居中 */

    color: rgb(16, 15, 15); /* 设置文字颜色以确保可读性 */
    padding: 20px; /* 添加一些内边距以让文字不紧贴边框 */

    font-size: 30px; /* 设置文字大小 */
    text-align: left; /* 可选：使文字居中 */
    border-radius: 10px; /* 可选：添加圆角边框 */
  }
  .join {
    position: relative;
    right: 1%; /* 保留最右边20%的空间 */
    font-size: medium;
    padding: 10px;
  }
  .record {
    width: 100%;
    padding: 40px;
    background-color: #ffffff;
    text-align: left;
  }
  .record:hover {
    color: #ffffff;
    opacity: 1;
    background-color: #e9ebeb;
  }
  .tag {
    width: 20%;
    padding: 10px;
    /* color: #ffffff; */
  }
  .title {
    text-decoration: underline; /* 为标题添加下划线 */
    color: #0000ee;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .content {
    font-size: 16px;
    color: black;
  }

  .author {
    font-size: 14px;
    color: #666;
  }
  .container {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between; /* 保持两侧对齐 */
    align-items: flex-start; /* 顶部对齐 */
    padding: 0; /* 移除内边距 */
  }
  .left {
    display: flex;
    width: calc(
      70% - 5px
    ); /* 如果需要在元素之间保留一点空间，可以通过减去一个小值来调整 */
    flex-direction: column; /* 元素垂直排列 */
  }
  .right {
    background-color: #ffffff;
    display: flex;
    width: 30%; /* 调整宽度以填满剩余空间 */
    height: 100%;
    flex-direction: column; /* 元素垂直排列 */
  }
  .all {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    height: 93%; /* 左侧部分占据全部高度 */
    margin-top: auto;
  }
  .father {
    display: flex;
    height: 100vh; /* 让容器占据整个视口高度 */
    width: 100vw;
    overflow-y: auto; /* 内容超出时显示滚动条 */
  }
</style>
