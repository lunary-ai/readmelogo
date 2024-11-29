import { Octokit } from "@octokit/core";
import { useState, useMemo, useEffect } from "react";
import { GitHubRepository } from "../types";

export const octokit = new Octokit({
  auth: process.env.GITHUB_ACCESS_TOKEN,

});

export function useRepository(owner: string, repo: string) {
  "use cache";

  const [repository, setRepository] = useState<GitHubRepository | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("fetching...")

    const promise = octokit.request(`GET /repos/${owner}/${repo}`, {
      owner, repo, headers:
        { "X-GitHub-Api-Version": "2022-11-28" },
    });
  
    promise.then((response) => {
      setLoading(false);
      setRepository(response.data);
    });
  }, [repo])

  return { repository, loading };
}
