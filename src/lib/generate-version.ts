import {
  MAJOR_REGEX,
  MINOR_REGEX,
  PATCH_REGEX,
  type Result,
  isInteger,
} from "../utils";

export default function generateVersion(
  commit: string,
  currentVersion: string,
  shouldReturnCommitError: boolean,
): Result<string, Error, false> {
  const parsedNumbers = currentVersion.split(".").map(Number);

  if (parsedNumbers.some((num) => !isInteger(num))) {
    return [undefined, new Error(`Invalid version format ${currentVersion}`)];
  }

  let [major, minor, patch] = parsedNumbers;

  const match = [PATCH_REGEX, MINOR_REGEX, MAJOR_REGEX].find((regex) =>
    regex.test(commit),
  );

  if (!match && shouldReturnCommitError)
    return [undefined, new Error("Invalid commit message")];

  if (match === MAJOR_REGEX) major++;
  if (match === MINOR_REGEX) minor++;
  if (match === PATCH_REGEX) patch++;

  return [`${major}.${minor}.${patch}`];
}
