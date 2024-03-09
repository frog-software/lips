import { writable } from "svelte/store";

export const currentUserEmail = writable("");
//在不同的组件间共享当前用户的电子邮件地址。
export const currentchannelid = writable("");
//共享当前的频道id
export const currentnoticeid = writable("");
//共享当前的通知id
