import { Messages } from "@mjt-engine/message";
import type { Env } from "./Env";

import { assertValue } from "@mjt-engine/assert";
import type { TunnelConnectionMap } from "@mjt-services/tunnel-common-2025";
import { getEnv } from "./getEnv";
import { tunnelAddListener } from "./listener/tunnelAddListener";
import { tunnelRemoveListener } from "./listener/tunnelRemoveListener";
import { tunnelResolveListener } from "./listener/tunnelResolveListener";

export const initConnection = async () => {
  const env = getEnv();
  const url = assertValue(env.NATS_URL);
  console.log("NATS_URL", url);

  await Messages.createConnection<TunnelConnectionMap, Env>({
    subscribers: {
      "tunnel.add": tunnelAddListener,
      "tunnel.remove": tunnelRemoveListener,
      "tunnel.resolve": tunnelResolveListener,
    },
    options: { log: console.log },
    server: [url],
    token: env.NATS_AUTH_TOKEN,
    env,
  });
  console.log("initConnection: init complete");
};
