<script>
  import Modal from "../routes/Modal.svelte";
  import { push } from "svelte-spa-router";
  import { onMount } from "svelte";
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  const pb = new PocketBase(PocketBase_URL);
  import { currentUserEmail, currentnoticeid, isJoinedTodo } from "../store.js";

  let showModal3 = false;

  function toggleModal3() {
    showModal3 = !showModal3;
  }

  let recordsNotice = [];
  async function checkNotice() {
    try {
      const userEmail = $currentUserEmail;
      const response = await pb.collection("notices").getFullList({
        sort: "-created",
        filter: `useremail="${userEmail}"`,
      });
      recordsNotice = response;
    } catch (error) {
      alert("fail to find");
    }
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

  function editnotice(noticeid) {
    currentnoticeid.set(noticeid);
    push("/updatenotice");
  }

  async function deletenotice(noticeid) {
    if (!confirm("确定要删除这则通知吗？")) {
      return;
    }
    try {
      const notices = await pb.collection("notices").getFullList({
        filter: `id="${noticeid}"`,
      });
      for (const notice of notices) {
        await pb.collection("notices").delete(notice.id);
      }
      alert("频道及相关数据删除成功。");
      checkNotice();
    } catch (error) {
      console.error("删除频道及相关数据失败：", error);
      alert("删除频道及相关数据失败。");
    }
  }

  onMount(() => {
    checkNotice();
  });
</script>

<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
  <div
    class="w-10 rounded-full"
    role="button"
    tabindex="0"
    on:click={toggleModal3}
    on:keypress
  >
    <img alt="Tailwind CSS Navbar component" src="searchChannelPicture.jpg" />
  </div>
</div>

<Modal isOpen={showModal3} close={toggleModal3}>
  <h2>通 知 管 理</h2>
  <div class="container">
    {#each recordsNotice as record}
      <div
        class="record"
        role="button"
        tabindex="0"
        on:click={() => check(record.id, record.tittle)}
        on:keypress
      >
        <div class="title">{record.tittle}</div>
        <div class="content">#{record.tag}</div>
        <div class="author">from:{record.username}</div>
      </div>
      <div>
        <button class="edit-btn" on:click={() => editnotice(record.id)}
          >修改</button
        >
        <button class="delete-btn" on:click={() => deletenotice(record.id)}
          >删除</button
        >
      </div>
    {/each}
  </div>
</Modal>

<style>
  .container {
    width: 300px;
    height: 220px; /* 设置列表的最大高度 */
    overflow-y: auto; /* 超出部分显示滚动条 */
    background: #f9f9f9; /* 背景色，可根据需要调整 */
    border-radius: 5px; /* 边框圆角 */
    padding: 10px; /* 内边距 */
  }
  .record {
    margin-bottom: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #ffffff;
  }
  .title {
    color: black;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .content {
    color: black;
    font-size: 16px;
  }

  .author {
    font-size: 14px;
    color: #666;
  }

  .edit-btn,
  .delete-btn {
    margin-left: 0.5rem;
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
    background-color: #4e4e4e; /* 按钮的背景颜色 */
    color: white;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .edit-btn:hover {
    background-color: #5c5c5c; /* 修改按钮悬停时的背景颜色 */
  }

  .delete-btn:hover {
    color: white;
    background-color: #a54444; /* 删除按钮悬停时的背景颜色 */
  }
</style>
