import * as core from "@actions/core";
import { type Result, TAG_REGEX, VERSION_REGEX, exec } from "../utils";

export default async function extractVersion(): Result<string, Error> {
  let version = core.getInput("version", {
    trimWhitespace: true,
  });

  // biome-ignore lint/suspicious/noConfusingLabels: Break statement
  use_tag: if (!version) {
    const [, fetchError] = await exec("git fetch --tags");

    if (fetchError && !process.env.ACT) return [undefined, fetchError];

    const [ok] = await exec(
      "git describe --tags `git rev-list --tags --max-count=1`",
    );

    if (!ok) break use_tag;

    const tagPattern = core.getInput("tag-pattern") || TAG_REGEX;
    const match = ok?.match(new RegExp(tagPattern));

    if (!match) break use_tag;

    const matchedVersion = match.find((v) => VERSION_REGEX.test(v));

    if (!matchedVersion)
      return [undefined, new Error(`No version found in ${ok}`)];

    version = matchedVersion;
  }

  if (!version) {
    const initialVersion = core.getInput("initial-version", {
      trimWhitespace: true,
    });

    if (!initialVersion) return [undefined, new Error("No version found")];

    const matchedVersion = initialVersion.match(VERSION_REGEX);

    if (!matchedVersion) return [undefined, new Error("No version found")];

    version = matchedVersion[0];
  }

  return [version];
}
