import { writable } from "svelte/store";

export const currentUserEmail = writable("");
//在不同的组件间共享当前用户的电子邮件地址。
