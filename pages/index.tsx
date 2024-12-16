import Fuse from "fuse.js";
import {
  Autocomplete,
  Button,
  Container,
  Flex,
  Grid,
  Group,
  Stack,
  TextInput,
} from "@mantine/core";
import { HeroSection } from "../components/hero";
import { RepoCard } from "../components/repo";

import csvtojson from "csvtojson";
import { Octokit } from "@octokit/core";
import { GitHubRepository } from "../types";

import type { GetServerSideProps } from "next/types";
import { useMemo, useState } from "react"
import { IconSearch } from "@tabler/icons-react";
import { Sidebar } from "../components/sidebar";

export const getServerSideProps = (async ({ res }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=21600, stale-while-revalidate=59"
  );

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

export default function IndexPage({
  repositories,
}: {
  repositories: { repository: GitHubRepository; entry: any }[];
}) {
  const [filters, setFilters] = useState({
    minStars: 0,
    maxStars: Infinity,
    minPrice: 0,
    maxPrice: Infinity,
    query: "",
    tags: [],
    placement: {
      readme: true,
      website: true,
    },
  });

  const fuse = new Fuse(repositories, {
    keys: [
      "repository.full_name",
      "repository.topics",
      "repository.description",
    ],
    threshold: 0.3,
  });

  const filteredResults = useMemo(() => {
    const { minStars, maxStars, query, tags, minPrice, maxPrice, placement } =
      filters;
    let repositoriesToQuery = query
      ? fuse.search(query).map((result) => result.item)
      : repositories;

    repositoriesToQuery = repositoriesToQuery.filter(({ entry }) => {
      if (entry.placement === "both") {
        return placement.readme || placement.website;
      }

      if (entry.placement === "readme") {
        return placement.readme;
      }

      if (entry.placement === "website") {
        return placement.website;
      }

      return false;
    });

    if (tags?.length > 0) {
      repositoriesToQuery = repositoriesToQuery.filter(({ repository }) => {
        return tags.find((tag) => repository.topics.includes(tag));
      });
    }

    if (minPrice && maxPrice) {
      repositoriesToQuery = repositoriesToQuery.filter(({ entry }) => {
        return entry.ad_price >= minPrice && entry.ad_price <= maxPrice;
      });
    }

    if (minStars && maxStars) {
      repositoriesToQuery = repositoriesToQuery.filter(({ repository }) => {
        return (
          repository.stargazers_count >= minStars &&
          repository.stargazers_count <= maxStars
        );
      });
    }

    return repositoriesToQuery;
  }, [filters, repositories]);

  return (
    <Stack
      mt={50}
      justify="center"
      style={{
        position: "sticky",
        top: 0,
      }}
    >
      <HeroSection />

      <Stack>
        <Sidebar
          repositories={repositories}
          results={filteredResults}
          filters={filters}
          setFilters={setFilters}
        />
        <Group m="lg" justify="center">
          <Autocomplete
            style={{ position: "sticky", top: 65, zIndex: 10, width: "80%" }}
            leftSection={<IconSearch size={16} stroke={1.5} />}
            placeholder="Search repositories..."
            size="lg"
            value={filters.query}
            data={repositories.map(({ repository }) => repository.full_name)}
            onChange={(query) =>
              setFilters((filters) => ({ ...filters, query }))
            }
          />
          <Grid my="md" mx="auto">
            {filteredResults.map(({ repository, entry }) => (
              <Grid.Col key={repository.id} span={{ base: 12, lg: 4, md: 6 }}>
                <RepoCard
                  repository={repository}
                  entry={entry}
                  setFilters={setFilters}
                />
              </Grid.Col>
            ))}
          </Grid>
        </Group>
      </Stack>
    </Stack>
  );
}
