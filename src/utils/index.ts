import { exec as node_exec } from "node:child_process";

export type Result<T, E = Error, P = true> = P extends true
  ? Promise<[T?, E?]>
  : [T?, E?];

export function isInteger(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    Number.isFinite(value) &&
    !Number.isNaN(value)
  );
}

export const PATCH_REGEX =
  /^(build|chore|ci|docs|fix|perf|refactor|revert|style|test)(\(.+\))?: .+$/;
export const MINOR_REGEX = /^(feat|feature)(\(.+\))?: .+$/;
export const MAJOR_REGEX = /^(BREAKING CHANGE|breaking|release)(\(.+\))?: .+$/;
export const TAG_REGEX = /(v)?(\d+\.\d+\.\d+)/;
export const VERSION_REGEX = /^(\d+\.\d+\.\d+)$/;

export function exec(command: string): Result<string, Error> {
  return new Promise<Result<string, Error, false>>((resolve) => {
    node_exec(command, (error, stdout, stderr) => {
      if (error) return resolve([undefined, new Error(stderr)]);

      resolve([stdout]);
    });
  });
}
