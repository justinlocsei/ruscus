# Release Management

Each Ruscus release involves a Git tag, GitHub release, and npm package tied to a single commit.  Releases use a version number that follows semantic versioning.  In the workflow below, any instance of `<version>` is a placeholder that would be substituted with a value like `0.1.0` or `3.2.1` for an actual release.

## Workflow

To publish a new version of Ruscus, take the following steps:

1. Update `main` and create a release branch named `release/<version>`.
2. Add a `## [<version>] (YYYY-MM-DD)` section to `CHANGELOG.md`, grouping bullets under Features, Changes, Fixes, or Development as needed, and add reference links to the footer.
3. Bump the version: `npm version <version> --no-git-tag-version`
4. Commit the updated changelog and package files with the message "Release `<version>`".
5. Push and open a PR against `main` with a title of "Release `<version>`" and a Release tag.
6. Wait for all CI tasks to pass.
7. Merge the PR.
8. Wait for all CI tasks to pass on `main`.
9. Update `main` and tag the latest commit: `git tag v<version>`
10. Push the release tag: `git push origin v<version>`
11. Wait for [the Release workflow](https://github.com/justinlocsei/ruscus/actions/workflows/release.yml) to complete, which will create a staged package in npm for the next version of Ruscus.
13. Approve the staged package [on npm](https://www.npmjs.com/).
14. [Create a GitHub Release](https://github.com/justinlocsei/ruscus/releases/new) from the version tag (`v<version>`), using the tag as the title and the text from `CHANGELOG.md` as the release notes.
