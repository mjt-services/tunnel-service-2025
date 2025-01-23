import type { ConnectionListener } from "@mjt-engine/message";
import type { TunnelConnectionMap } from "@mjt-services/tunnel-common-2025";
import { TunnelMap } from "./TunnelMap";


export const tunnelRemoveListener: ConnectionListener<
  TunnelConnectionMap, "tunnel.remove"
> = async (props) => {
  const { name } = props.detail.body;

  const { controller } = TunnelMap[name];
  controller.stop();
  return { success: true };
};
