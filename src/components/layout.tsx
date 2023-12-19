import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

export function Layout({ children }: PropsWithChildren) {
  return (
    <div>
      <nav>
        <Link to="/">home</Link>
      </nav>
      <div>{children}</div>
    </div>
  );
}
