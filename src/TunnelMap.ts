import type { ProcController } from "./common/proc";

export const TunnelMap: Record<
  string,
  { controller: ProcController; port: number }
> = {};
