import csvtojson from "csvtojson";
import { Octokit } from "@octokit/core";
import { useState, useEffect } from "react";
import { GitHubRepository } from "../types";

export const octokit = new Octokit({
  // auth: process.env.NEXT_PUBLIC_GITHUB_ACCESS_TOKEN,
});

export function useRepository(owner: string, repo: string) {
  "use cache";

  const [repository, setRepository] = useState<GitHubRepository | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("fetching...");

    const promise = octokit.request(`GET /repos/${owner}/${repo}`, {
      owner, repo, headers:
        { "X-GitHub-Api-Version": "2022-11-28" }
    });

    promise.then((response) => {
      setLoading(false);
      setRepository(response.data);
    });
  }, [repo]);

  return { repository, loading };
}

export function useRepos() {
  "use cache";

  const [repositories, setRepositories] = useState<{ repo: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("fetching repos...");

    // const promise = fetch(
    //   process.env.NEXT_PUBLIC_GITHUB_ENTRIES_URL as string,
    //   {
    //     next: { revalidate: 6 * 60 * 60 },
    //   }
    // );

    // promise.then(async (response) => {
    //   const data = await csvtojson().fromString(await response.text());

    //   setLoading(false);
    //   setRepositories(data);
    // });

    setTimeout(async () => {
      setLoading(false);
      setRepositories(await csvtojson().fromString(`repo,ad_price,placement, sponsor_url
libgit2/pygit2, 50, repo, https://github.com/sponsors/jdavid
lunary-ai/lunary, 50, repo, https://github.com/sponsors/lunary`));
    }, 500);
  }, []);

  return { repositories, loading };
}
