import type { ConnectionListener } from "@mjt-engine/message";
import { isDefined } from "@mjt-engine/object";
import type { TunnelConnectionMap } from "@mjt-services/tunnel-common-2025";
import { proc } from "./common/proc";
import { validateRequiredFields } from "./common/validateRequiredFields";
import { nextLocalPort } from "./nextLocalPort";
import { TunnelMap } from "./TunnelMap";

export const tunnelAddListener: ConnectionListener<
  TunnelConnectionMap,
  "tunnel.add"
> = async (props) => {
  const {
    name,
    options = [],
    remoteHost,
    targetHost = "localhost",
    targetPort,
    localPort,
    passphrase,
    privateKeyPath = "/root/.ssh/id_rsa",
    remotePort = 22,
    remoteUser = "root",
  } = props.detail.body;

  if (passphrase) {
    throw new Error("passphrase not implemented");
  }
  validateRequiredFields(props.detail.body, ["remoteHost", "targetPort"]);

  const realizedLocalPort = isDefined(localPort)
    ? localPort
    : await nextLocalPort();

  // ssh -i /root/.ssh/id_rsa -L 8080:localhost:9000 -N -f user@remote-host -p 22
  const controller = proc("vastai", { verbose: true })(
    "ssh",
    "-i",
    privateKeyPath,
    "-L",
    `${realizedLocalPort}:${targetHost}:${targetPort}`,
    "-N",
    "-f",
    `${remoteUser}@${remoteHost}`,
    `-p ${remotePort}`,
    ...options
  );
  TunnelMap[name] = { controller, port: realizedLocalPort };
  return { port: realizedLocalPort, name };
};
