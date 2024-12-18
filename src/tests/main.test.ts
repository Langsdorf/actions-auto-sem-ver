import { expect, test } from "@jest/globals";
import generateVersion from "../lib/generate-version";

test("should increment major", async () => {
  const initialVersion = "1.0.0";
  const commit = "BREAKING CHANGE: something";

  const [result] = generateVersion(commit, initialVersion, false, "major");

  if (!result) throw new Error("Result is undefined");

  expect(result).toBe("2.0.0");
});

test("should increment minor", async () => {
  const initialVersion = "1.0.0";
  const commit = "feat: something";

  const [result] = generateVersion(commit, initialVersion, false, "major");

  if (!result) throw new Error("Result is undefined");

  expect(result).toBe("1.1.0");
});

test("should increment patch", async () => {
  const initialVersion = "1.0.0";
  const commit = "fix: something";

  const [result] = generateVersion(commit, initialVersion, false, "major");

  if (!result) throw new Error("Result is undefined");

  expect(result).toBe("1.0.1");
});

test("should return error on invalid version", async () => {
  const initialVersion = "v1.0.0";
  const commit = "fix: something";

  const [, error] = generateVersion(commit, initialVersion, true, "major");

  if (!error) throw new Error("Error is undefined");

  expect(error.message).toBe(`Invalid version format ${initialVersion}`);

  expect(error).toBeInstanceOf(Error);
});

test("should return error on invalid commit", async () => {
  const initialVersion = "1.0.0";
  const commit = "f1x: something";

  const [, error] = generateVersion(commit, initialVersion, true, "major");

  if (!error) throw new Error("Error is undefined");

  expect(error.message).toBe("Invalid commit message");

  expect(error).toBeInstanceOf(Error);
});

test("should increment major on invalid version", async () => {
  const initialVersion = "1.0.0";
  const commit = "f1x: something";

  const [result] = generateVersion(commit, initialVersion, false, "major");

  if (!result) throw new Error("Result is undefined");

  expect(result).toBe("2.0.0");
});
