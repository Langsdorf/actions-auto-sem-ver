import * as core from "@actions/core";
import extractCommit from "./lib/extract-commit";
import extractVersion from "./lib/extract-version";
import generateVersion from "./lib/generate-version";
import { exec } from "./utils";

async function main() {
  const [commitInput, extractCommitError] = await extractCommit();

  if (!commitInput || extractCommitError) {
    core.setFailed(extractCommitError?.message ?? "No commit message found");
    process.exit(1);
  }

  core.info(`Commit message: ${commitInput}`);

  const [version, extractVersionError] = await extractVersion();

  if (!version || extractVersionError) {
    core.setFailed(extractVersionError?.message ?? "No version found");
    process.exit(1);
  }

  core.info(`Current version: ${version}`);

  const shouldReturnCommitError = core.getBooleanInput(
    "error-on-invalid-commit",
  );

  const [generatedVersion, error] = generateVersion(
    commitInput,
    version,
    shouldReturnCommitError,
  );

  if (!generatedVersion || error) {
    core.setFailed(error?.message ?? "Version could not be generated");
    process.exit(1);
  }

  core.info(`Generated version: ${generatedVersion}`);

  core.setOutput("version", generatedVersion);

  if (version === generatedVersion) {
    core.warning("No version bump detected");
    process.exit(0);
  }

  const createTag = core.getBooleanInput("create-tag");

  if (!createTag) {
    core.info("Skipping tag creation");
    core.setOutput("tag", "");
    process.exit(0);
  }

  const tagPrefix = core.getInput("tag-prefix", { trimWhitespace: true });

  const tag = `${tagPrefix}${generatedVersion}`;

  core.info(`Creating tag: ${tag}`);

  const [existsTag] = await exec(`git rev-parse --verify --quiet ${tag}`);

  if (existsTag) {
    core.warning(`Tag ${tag} already exists`);
    core.setOutput("tag", tag);
    process.exit(0);
  }

  const [, tagError] = await exec(`git tag ${tag}`);

  if (tagError) {
    core.setFailed(tagError.message);
    process.exit(1);
  }

  const [, pushTagError] = await exec("git push origin --tags");

  if (pushTagError) {
    core.setFailed(pushTagError.message);
    process.exit(1);
  }

  core.setOutput("tag", tag);

  core.info(`Tag ${tag} created and pushed successfully`);
}

main();
