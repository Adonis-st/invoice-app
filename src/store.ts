import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const modalAtom = atom(false);

export const datePickerAtom = atom(false);

export const darKModeAtom = atomWithStorage("darkMode", false);
