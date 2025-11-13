import { atom } from "jotai";
import type { DeskInfo } from "./types";

const cookie = document.cookie

export const isLoginAtom = atom(cookie.includes('userid'))

export const deskInfoAtom = atom<DeskInfo | null>(null)