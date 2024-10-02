import * as core from "@actions/core";
import { type Result, exec } from "../utils";

export default async function extractCommit(): Result<string, Error> {
  let commitInput = core.getInput("commit", {
    trimWhitespace: true,
  });

  if (!commitInput) {
    const [ok, error] = await exec("git log -1 --pretty=%B");

    if (error) return [undefined, error];

    commitInput = ok?.trim() ?? "";
  }

  if (!commitInput) return [undefined, new Error("No commit message found")];

  return [commitInput];
}
