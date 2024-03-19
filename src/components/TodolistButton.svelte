<script>
  import Modal from "../routes/Modal.svelte";
  import { push } from "svelte-spa-router";
  import { onMount } from "svelte";
  import PocketBase from "pocketbase";
  import { PocketBase_URL } from "../utils/api/index";
  const pb = new PocketBase(PocketBase_URL);
  import { currentUserEmail, currentnoticeid, isJoinedTodo } from "../store.js";

  let showModal4 = false;
  let showtodo = true;
  function toggleModal4() {
    showModal4 = !showModal4;
  }

  let todo = [];
  async function checkTodolist() {
    try {
      const userEmail = $currentUserEmail;
      const response = await pb.collection("todolist").getFullList({
        sort: "-created",
        filter: `useremail="${userEmail}"`,
      });
      todo = response;
    } catch (error) {
      alert("fail to find");
    }
  }

  async function jumptodo(title) {
    if (showtodo == true) {
      const response_ = await pb.collection("notices").getFullList({
        sort: "-created",
        filter: `tittle="${title}"`,
      });

      currentnoticeid.set(response_[0].id);
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
    showtodo = true;
  }

  async function deletetodo(todoid) {
    if (!confirm("确定要从待办事项中删除这则通知吗？")) {
      showtodo = false;
      return;
    }
    try {
      const todos = await pb.collection("todolist").getFullList({
        filter: `id="${todoid}"`,
      });
      for (const todo of todos) {
        await pb.collection("todolist").delete(todo.id);
      }
      alert("删除成功。");
      checkTodolist();
    } catch (error) {
      console.error("删除失败：", error);
      alert("删除失败。");
    }
  }

  onMount(() => {
    checkTodolist();
  });
</script>

<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
  <div
    class="w-10 rounded-full"
    role="button"
    tabindex="0"
    on:click={toggleModal4}
    on:keypress
  >
    <img alt="Tailwind CSS Navbar component" src="selectTagsPicture.jpg" />
  </div>
</div>

<Modal isOpen={showModal4} close={toggleModal4}>
  <h2>待 办 事 项</h2>
  <div class="container">
    {#each todo as todothing}
      <div
        class="record"
        role="button"
        tabindex="0"
        on:click={() => jumptodo(todothing.tittle)}
        on:keypress
      >
        <button class="chacha" on:click={() => deletetodo(todothing.id)}
          >x</button
        >
        <div class="title">{todothing.tittle}</div>
        <div class="content">#{todothing.tag}</div>
        <div class="author">
          from:{todothing.year}/{todothing.month}/{todothing.day}
        </div>
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

  .chacha {
    background-color: white;
    width: 20px;
    color: #a3a1a1;
    float: right;
    text-align: center;
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
</style>
