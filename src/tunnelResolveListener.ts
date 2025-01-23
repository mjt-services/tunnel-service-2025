import type { ConnectionListener } from "@mjt-engine/message";
import type { TunnelConnectionMap } from "@mjt-services/tunnel-common-2025";
import { TunnelMap } from "./TunnelMap";


export const tunnelResolveListener: ConnectionListener<
  TunnelConnectionMap, "tunnel.resolve"
> = async (props) => {
  const { name } = props.detail.body;

  const { port } = TunnelMap[name];
  return { port };
};
