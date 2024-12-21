import csvtojson from "csvtojson";
import { Octokit } from "@octokit/core";
import type { Repository } from "../types";

export const octokit = new Octokit({
  // Not important but can be used to get around gihtub rate limits
  auth: process.env.GITHUB_ACCESS_TOKEN as string,
});

/**
 * Fetches the repositories from the GitHub API
 * @returns An array of repositories
 */
export async function fetchRepositories(): Promise<Repository[]> {
  const response = await fetch(process.env.GITHUB_ENTRIES_URL as string);
  return await Promise.all(
    (
      await csvtojson().fromString(await response.text())
    ).map(async (entry) => {
      const [organization, repoName] = entry.repo.split("/");
      const { data } = await octokit.request(
        `GET /repos/${organization}/${repoName}`,
        {
          organization,
          repo: repoName,
          headers: { "X-GitHub-Api-Version": "2022-11-28" },
        }
      );
      return { repository: data, entry };
    })
  );

}
