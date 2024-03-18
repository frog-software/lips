import { writable } from "svelte/store";

export const currentUserEmail = writable("");
//在不同的组件间共享当前用户的电子邮件地址。
export const currentchannelid = writable("");
//共享当前的频道id
export const currentnoticeid = writable("");
//共享当前的通知id
export const currentchannelName = writable("");
//共享当前的频道名
export const selectedtag = writable("");
//记录选择的tag
export const originChannelID = writable("");
//channels的id
export const isJoinedTodo = writable("");

export const username = writable("");
export const channelName = writable("");
