# Auto Versioning Action

Github Action for automatic semantic versioning based on commit messages.

This action is based on the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

The action will read the last commit message and determine the next version based on the following rules:

- If the commit message contains `BREAKING CHANGE|breaking:`, the major version will be incremented.
- If the commit message contains `feat|feature:`, the minor version will be incremented.
- If the commit message contains `build|chore|ci|docs|fix|perf|refactor|revert|style|test:`, the patch version will be incremented.
- Otherwise, if `error-on-invalid-commit` is `true`, the action will throw an error.

If the repository does't have a tag yet, the action will return the version `1.0.0` or the version specified in the `initial-version` input.

## Inputs

### `commit`

| Required: `false`
| Default: `The commit message`

The commit message to use for versioning. If not provided, the action will use the commit message that triggered the workflow.

### `version`

| Required: `false`
| Default: `The latest tag`

The latest version in the repository. If not provided, the action will use the latest tag that matches the pattern.

### `initial-version`

| Required: `false`
| Default: `1.0.0`

The version to use if the repository does't have a tag yet.

### `error-on-invalid-commit`

| Required: `false`
| Default: `false`

Whether to throw an error if the commit message is invalid.

### `tag-pattern`

| Required: `false`
| Default: `(v)?(\d+\.\d+\.\d+)`

The pattern to match the tags in the repository.

### `tag-prefix`

| Required: `false`
| Default: ""

The prefix to add to the new version.

### `create-tag`

| Required: `false`
| Default: `false`

Whether to create a new tag in the repository.

## Outputs

### `version`

The new version calculated based on the commit message.

### `tag`

The new tag to create in the repository. If `create-tag` is `false`, this output will be empty.

## Example usage

```yaml
name: Generate Version
id: gen-version
uses: Langsdorf/actions-auto-sem-ver@1.0.1
with:
  create-tag: true
```

```yaml
name: Generate Version
id: gen-version
uses: Langsdorf/actions-auto-sem-ver@1.0.1
with:
  initial-version: "1.0.0"
  tag-pattern: '(v)?(\d+\.\d+\.\d+)'
  tag-prefix: "v"
  create-tag: true
```

```yaml
name: Output version
run: echo "The new version is ${{ steps.gen-version.outputs.version }}" # The new version is 1.0.1
```

```yaml
name: Output tag
run: echo "The new tag is ${{ steps.gen-version.outputs.tag }}" # The new tag is (v)?1.0.1
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
