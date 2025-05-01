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
  const classes = classNames(styles.button, className, styles[size]);
  if ("href" in props) {
    return (
      <Link className={classes} to={props.href}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} onClick={props.onClick}>
      {children}
    </button>
  );
}

export interface BaseButtonProps extends PropsWithChildren {
  className?: string;
}
export function ButtonList({ className, children }: BaseButtonProps) {
  return <div className={classNames(styles.list, className)}>{children}</div>;
}
