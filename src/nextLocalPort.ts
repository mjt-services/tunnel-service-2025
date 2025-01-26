import { createServer } from "net";
import { TunnelMap } from "./TunnelMap";

/**
 * determine the next available local port that can be used for a tunnel
 */

export const nextLocalPort = async ({
  port = 1024,
  endPort = 65535,
}: Partial<{ port: number; endPort: number }> = {}): Promise<number> => {
  // _nextPort = _nextPort + 1;
  // return _nextPort;

  const isPortAvailable = (port: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const server = createServer();
      server.once("error", () => resolve(false));
      server.once("listening", () => {
        server.close(() => resolve(true));
      });
      server.listen(port);
    });
  };

  while (port <= endPort) {
    if (!TunnelMap[port] && (await isPortAvailable(port))) {
      return port;
    }
    port++;
  }

  throw new Error("No available ports found");
};
