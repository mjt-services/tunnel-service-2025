import { promises as fs } from "fs";
import { dirname } from "path";

export const getKnownHostsFilepath = async () => {
  const knownHostsFile = `/root/.ssh/known_hosts`;

  try {
    await fs.access(knownHostsFile);
  } catch (error) {
    // Create the directory if it doesn't exist
    await fs.mkdir(dirname(knownHostsFile), { recursive: true });
    // Create the file
    await fs.writeFile(knownHostsFile, "");
  }

  return knownHostsFile;
};
