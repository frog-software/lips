<script>
    import { push, location } from "svelte-spa-router";
    import { onDestroy } from "svelte";
    import CircleButtonForPush from "../components/CircleButtonForPush.svelte";

    let showPop = false;
    let input = "";
    function Click() {
        showPop = !showPop;
    }

  function JumpNewPage(address) {
    push("/" + address);
  }
  let currentpath = "";
  const unsubscribe = location.subscribe(($location) => {
    currentpath = $location;
  });
  onDestroy(unsubscribe);
</script>

<h4>LIPS - Lightweight Information Portal Service</h4>

<body>
    {#if (currentpath = "/main")}
        <ul>
            用户
            <li>
                <button on:click={() => JumpNewPage("createChannel")}>
                    创建频道
                </button>
            </li>
            <li>
                <button on:click={() => JumpNewPage("checkInformation")}>
                    查看通知
                </button>
            </li>
            <li>
                <button on:click={() => JumpNewPage("yourChannel")}>
                    你加入的频道
                </button>
            </li>
            <li>
                <button on:click={() => JumpNewPage("login")}>
                    登出
                </button>
            </li>
        </ul>
        <div class="search-container">
            <button on:click={Click}> 🔍 </button>
            <div style:display={showPop ? "block" : "none"}>
                <input
                    type="text"
                    bind:value={input}
                    placeholder="查找频道id"
                />
                <button>search</button>
            </div>
        </div>
    {/if}
</body>
<div class="button-manage" >
    <CircleButtonForPush
        address="/searchChannel"
        info="查找频道"
        src="searchChannelPicture.jpg"
    />
    <CircleButtonForPush
        address="/createChannel"
        info="创建频道"
        src="createChannelPicture.jpg"
    />
    <CircleButtonForPush
        address="/selectTags"
        info="筛选标签"
        src="selectTagsPicture.jpg"
    />
    <CircleButtonForPush
        address="/postnotice"
        info="发送通知"
        src="postnoticePicture.jpg"
    />
    <CircleButtonForPush
        address="/participants"
        info="频道成员"
        src="participantsPicture.jpg"
    />
</div>

<style>
    .search-container {
        display: flex;
        align-items: center;
    }
</style>
