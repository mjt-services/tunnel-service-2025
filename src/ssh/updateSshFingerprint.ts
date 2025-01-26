import { appendFile, readFile } from "fs/promises";
import { cmd } from "../common/cmd";
import { getKnownHostsFilepath } from "./getKnownHostsFilepath";

export const updateSshFingerprint = async (hostOrIp: string, port: number) => {
  const knownHostsFile = await getKnownHostsFilepath();
  const knownHostsContent = await readFile(knownHostsFile, "utf8");
  const hostWithPort = `[${hostOrIp}]:${port}`;

  if (knownHostsContent.includes(hostWithPort)) {
    console.log(`Host ${hostWithPort} is already known.`);
    return false;
  }

  await cmd(`ssh-keygen`, { verbose: true })(
    `-R ${hostWithPort} -f ${knownHostsFile}`
  );
  const fingerprints = await cmd(`ssh-keyscan`, { verbose: true })(
    `-p ${port} ${hostOrIp}`
  );
  if (!fingerprints) {
    throw new Error(
      `updateSshFingerprint: no ssh fingerprints for: ${hostWithPort}`
    );
  }
  console.log(`Updated ${knownHostsFile} for: ${hostWithPort}`);
  await appendFile(knownHostsFile, fingerprints);
  return true;
};