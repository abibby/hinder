import { MouseEventHandler, PropsWithChildren } from "react";
import { Link } from "react-router-dom";
import styles from "./button.module.css";
import classNames from "classnames";

export interface BaseButtonProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export interface LinkButtonProps extends BaseButtonProps {
  href: string;
}

export interface ButtonButtonProps extends BaseButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export type ButtonProps = LinkButtonProps | ButtonButtonProps;

export function Button({
  children,
  className,
  size = "md",
  ...props
}: PropsWithChildren<ButtonProps>) {
  if ("href" in props) {
    return (
      <Link
        className={classNames(styles.button, className, styles[size])}
        to={props.href}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      className={classNames(styles.button, className)}
      onClick={props.onClick}
    >
      {children}
    </button>
  );
}
