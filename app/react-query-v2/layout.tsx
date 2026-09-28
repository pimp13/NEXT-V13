import { ReactElement } from "react";
import { QueryProvider } from "./providers/QueryProvider";

export default function ReactQueryLayoutV2({
  children,
}: {
  children: ReactElement;
}) {
  return (
    <QueryProvider>{children}</QueryProvider>
  );
}
