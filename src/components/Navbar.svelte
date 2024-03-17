<script>
  import { username } from "../store.js";

  let isOpen = false;

  function toggleDrawer() {
    isOpen = !isOpen;
  }
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
    <div class="flex-1">
      <a href="/#/infoPage" class="btn btn-ghost text-xl logo">lips</a>
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

<style>
  .navbar {
    position: fixed; /* 或 absolute，根据需要选择 */
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1000; /* 确保这个值足够高，以覆盖其他元素 */
    /* 其他样式，如背景色等 */
  }
</style>
