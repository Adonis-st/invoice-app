import { atom } from "jotai";
import { data } from "./data";

export const invoiceAtom = atom(data);

export const modalAtom = atom(false);

export const datePickerAtom = atom(false);
