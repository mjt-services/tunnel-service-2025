import { toMany } from "@mjt-engine/object";
import { spawn, ChildProcess } from "child_process";
import { EventEmitter } from "events";

export type ProcController = {
  stop: () => void;
  suspend: () => void;
  resume: () => void;
  process: ChildProcess;
  on: (
    event: "output" | "error" | "exit",
    listener: (data: string | number) => void
  ) => void;
  off: (
    event: "output" | "error" | "exit",
    listener: (data: string | number) => void
  ) => void;
};

export const proc = (
  command: string,
  options: Partial<{ verbose: boolean }> = {}
) => {
  const { verbose = false } = options;

  return (...argsAsStringOrStringArray: string[]): ProcController => {
    const args = toMany(argsAsStringOrStringArray)
      .flatMap((s) => s.replace("\n/g", ""))
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const fullCommand = [command, ...args];
    if (verbose) {
      console.log(`Executing: ${fullCommand.join(" ")}`);
    }

    const process = spawn(command, args, { shell: true });
    const events = new EventEmitter();

    // Process events
    process.stdout.on("data", (data) => {
      const str = data.toString();
      if (verbose) {
        console.log(str);
      }
      events.emit("output", str);
    });

    process.stderr.on("data", (data) => {
      const str = data.toString();
      if (verbose) {
        console.error(str);
      }
      events.emit("error", str);
    });

    process.on("exit", (code) => {
      if (verbose) {
        console.log(`Process exited with code: ${code}`);
      }
      events.emit("exit", code || 0);
    });

    process.on("error", (err) => {
      events.emit("error", err.message);
    });

    // Controller object
    const controller: ProcController = {
      stop: () => {
        if (verbose) {
          console.log("Stopping process");
        }
        process.kill();
      },
      suspend: () => {
        if (verbose) {
          console.log("Suspending process");
        }
        process.kill("SIGSTOP"); // Suspend the process
      },
      resume: () => {
        if (verbose) {
          console.log("Resuming process");
        }
        process.kill("SIGCONT"); // Resume the process
      },
      process,
      on: (event, listener) => events.on(event, listener),
      off: (event, listener) => events.off(event, listener),
    };

    return controller;
  };
};
