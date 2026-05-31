import type { ReactNode } from "react";

type ModalProps = {
  children?: ReactNode;
};

export function Modal({ children }: ModalProps) {
  return <div role="dialog">{children}</div>;
}
