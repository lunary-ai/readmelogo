import Fuse from 'fuse.js'
import { Autocomplete, Button, Container, Grid, Group, Stack, TextInput } from "@mantine/core";
import { HeroSection } from "../components/hero";
import { RepoCard } from "../components/repo";

import csvtojson from "csvtojson";
import { Octokit } from "@octokit/core";
import { GitHubRepository } from "../types";

import type { GetServerSideProps } from "next/types";
import { useState } from 'react';
import { IconSearch } from '@tabler/icons-react';

export const getServerSideProps = (async ({ res }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=21600, stale-while-revalidate=59'
  )

  const octokit = new Octokit({
    auth: process.env.GITHUB_ACCESS_TOKEN,
  });

  const response = await fetch(process.env.GITHUB_ENTRIES_URL as string);
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
  const [query, setQuery] = useState('');
  const [filteredResults, setFilteredResults] = useState(repositories);

  const fuse = new Fuse(repositories, {
    keys: ['repository.full_name'],
    threshold: 0.3,
  });

  const handleSearch = (query: string) => {
    setQuery(query);
    if (query) {
      const results = fuse.search(query).map(result => result.item);
      setFilteredResults(results);
    } else {
      setFilteredResults(repositories);
    }
  };

  return (
    <Stack mt={50} justify="center">
      <HeroSection />

      <Container size="md" mb="xl" w="100%">
        <Autocomplete
          leftSection={<IconSearch size={16} stroke={1.5} />}
          placeholder="Search repositories..."
          size="lg"
          value={query}
          data={repositories.map(({ repository }) => repository.full_name)}
          onChange={(value) => handleSearch(value)}
        />
      </Container>

      <Container my="md">
        <Grid>
          {filteredResults.map(({ repository, entry }) => (
            <Grid.Col key={repository.id} span={{ base: 12, xs: 4 }}>
              <RepoCard repository={repository} entry={entry} />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Stack>
  );
}
