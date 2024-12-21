import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { Autocomplete, Grid, Group, Stack } from "@mantine/core";

import { RepoCard } from "../components/repo";
import { Sidebar } from "../components/sidebar";
import { HeroSection } from "../components/hero";
import { fetchRepositories } from "../utils/github";

import type { Repository } from "../types";
import type { GetServerSideProps } from "next/types";

const INITIAL_FILTER_STATE = {
  minStars: 0,
  maxStars: Infinity,
  maxPrice: Infinity,
  query: "",
  tags: [],
  placement: {
    readme: true,
    website: true,
  },
};

export const getServerSideProps = (async ({ res }) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=21600, stale-while-revalidate=59"
  );

  const repositories = await fetchRepositories();
  return { props: { repositories } };
}) satisfies GetServerSideProps<{
  repositories: Repository[];
}>;

export default function IndexPage({ repositories }: { 
  repositories: Repository[];
}) {
  const [filters, setFilters] = useState(INITIAL_FILTER_STATE);

  const fuse = new Fuse(repositories, {
    keys: [
      "repository.full_name",
      "repository.topics",
      "repository.description",
    ],
    threshold: 0.3,
  });

  const filteredResults = useMemo(() => {
    const { minStars, maxStars, query, tags, maxPrice, placement } = filters;
    let repositoriesToQuery = query
      ? fuse.search(query).map((result) => result.item)
      : repositories;

    repositoriesToQuery = repositoriesToQuery.filter(({ entry }) => {
      if (entry.placement === "both") return placement.readme || placement.website;
      return placement[entry.placement as "readme" | "website"];
    });

    if (tags?.length > 0) {
      repositoriesToQuery = repositoriesToQuery.filter(({ repository }) => {
        return tags.find((tag) => repository.topics.includes(tag));
      });
    }

    if (maxPrice) {
      repositoriesToQuery = repositoriesToQuery.filter(({ entry }) => {
        return entry.ad_price <= maxPrice;
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
          filters={filters}
          repositories={repositories}
          results={filteredResults}
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
