import type { ConnectionListener } from "@mjt-engine/message";
import { isDefined } from "@mjt-engine/object";
import type { TunnelConnectionMap } from "@mjt-services/tunnel-common-2025";
import { proc } from "./common/proc";
import { validateRequiredFields } from "./common/validateRequiredFields";
import { nextLocalPort } from "./nextLocalPort";
import { TunnelMap } from "./TunnelMap";
import { updateSshFingerprint } from "./ssh/updateSshFingerprint";

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

  await updateSshFingerprint(remoteHost, remotePort);

  // ssh -i /root/.ssh/id_rsa -L 8080:localhost:9000 -N -f user@remote-host -p 22
  const controller = proc("ssh", { verbose: true })(
    "-i",
    privateKeyPath,
    "-L",
    `127.0.0.1:${realizedLocalPort}:${targetHost}:${targetPort}`,
    "-N",
    "-f",
    `${remoteUser}@${remoteHost}`,
    `-p ${remotePort}`,
    ...options
  );
  controller.on("error", (err) => {
    console.error(err);
  });
  TunnelMap[name] = { controller, port: realizedLocalPort };
  return { port: realizedLocalPort, name };
};
