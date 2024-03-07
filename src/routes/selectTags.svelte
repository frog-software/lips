<script>
  import { onMount } from "svelte";
  import { PocketBase_URL } from "../utils/api/index";
  import PocketBase from "pocketbase";

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
      const newRecord = {
        tittle: check.tittle,
        body: check.body,
        tag: check.tag,
        year: check.year,
        month: check.month,
        day: check.day,
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
</style>
