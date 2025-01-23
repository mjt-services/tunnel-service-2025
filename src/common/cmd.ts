import { toMany } from "@mjt-engine/object";
import { spawn } from "child_process";

export const cmd =
  (
    command: string,
    options: Partial<{ dryRun: boolean; verbose: boolean }> = {}
  ) =>
  async (...argsAsStringOrStringArray: string[]) => {
    const { dryRun = false, verbose = false } = options;
    const args = toMany(argsAsStringOrStringArray)
      .flatMap((s) => s.replace("\n/g", ""))
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const fullCommand = [command, ...args];
    if (dryRun) {
      console.log(fullCommand.join(" "));
      return;
    }

    return new Promise<string>((resolve, reject) => {
      if (verbose) {
        console.log(fullCommand.join(" "));
      }
      const process = spawn(command, args, { shell: true });
      let output = "";
      let errOutput = "";
      process.stdout.on("data", (data) => {
        const str = data.toString();
        if (verbose) {
          console.log(str);
        }
        output += str;
      });
      process.on("error", (err) => {
        reject(err);
      });
      process.stderr.on("data", (data) => {
        const str = data.toString();
        if (verbose) {
          console.error(str);
        }
        errOutput += str;
      });
      process.on("exit", (code) => {
        if (code === 0) {
          return resolve(output);
        }
        if (verbose) {
          console.error(`cmd: ${command} exited with code: ${code}`);
        }
        reject(errOutput);
      });
    });
  };
