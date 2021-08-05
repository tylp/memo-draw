import { ReactNode } from "react";

export interface SectionTitleSpec {
    children: ReactNode;
	littleMessage?: string;
	hintColor?: string;
}