import { Button, Container, Grid, Group, Stack } from "@mantine/core";
import { HeroSection } from "../components/hero";
import { RepoCard } from "../components/repo";

import csvtojson from "csvtojson";
import { octokit } from "../utils/github";
import { GitHubRepository } from "../types";
import { GetServerSideProps } from "next/types";

export const getServerSideProps = (async () => {
  const response = await fetch(
    process.env.NEXT_PUBLIC_GITHUB_ENTRIES_URL as string,
    { next: { revalidate: 6 * 60 * 60 } }
  );

  const repositories = await Promise.all(
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
  return { props: { repositories } };
}) satisfies GetServerSideProps<{
  repositories: { repository: GitHubRepository; entry: any }[];
}>;

export default function IndexPage({ repositories }: {
  repositories: { repository: GitHubRepository; entry: any }[];
}) {
  console.log(repositories);

  return (
    <Stack mt={50} justify="center">
      <HeroSection />

      <Container my="md">
        <Grid>
          {repositories.map(({ repository, entry }) => (
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <RepoCard repository={repository} entry={entry} />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Stack>
  );
}
