import { use, useEffect, useMemo, useState } from "react";
import {
  IconBulb,
  IconCheckbox,
  IconGripVertical,
  IconPlus,
  IconPoint,
  IconRestore,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Badge,
  Box,
  Checkbox,
  CheckIcon,
  Code,
  Combobox,
  Container,
  Flex,
  Group,
  Pill,
  PillsInput,
  RangeSlider,
  Stack,
  Text,
  TextInput,
  Tooltip,
  UnstyledButton,
  useCombobox,
} from "@mantine/core";
import { nFormatter } from "../utils/formatter";
import classes from "../styles/sidebar.module.css";

import type { Filters, GitHubRepository, SidebarProps } from "../types";

function calculateStars(
  results: { repository: GitHubRepository; entry: any }[]
) {
  return [
    results.reduce(
      (min, repo) => Math.min(min, repo.repository.stargazers_count),
      Number.MAX_SAFE_INTEGER
    ),
    results.reduce(
      (max, repo) => Math.max(max, repo.repository.stargazers_count),
      0
    ),
  ];
}

function calculatePrice(
  results: { repository: GitHubRepository; entry: any }[]
) {
  return [
    results.reduce(
      (min, repo) => Math.min(min, repo.entry.ad_price),
      Number.MAX_SAFE_INTEGER
    ),
    results.reduce((max, repo) => Math.max(max, repo.entry.ad_price), 0),
  ];
}

export function Sidebar({
  repositories,
  results,
  filters,
  setFilters,
}: SidebarProps) {
  const [originalMinStars, originalMaxStars] = calculateStars(repositories);
  const [minStars, maxStars] = useMemo(
    () => calculateStars(results),
    [results]
  );

  const [originalMinPrice, originalMaxPrice] = calculatePrice(repositories);
  const [minPrice, maxPrice] = useMemo(
    () => calculatePrice(results),
    [results]
  );

  useEffect(() => {
    setFilters((filters: Filters) => ({
      ...filters,
      minPrice: originalMinPrice,
      maxPrice: originalMaxPrice,
    }));
  }, []);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const [search, setSearch] = useState("");

  const handleValueSelect = (val: string) =>
    setFilters((filters: Filters) => ({
      ...filters,
      tags: filters.tags.includes(val)
        ? filters.tags.filter((v) => v !== val)
        : [...filters.tags, val],
    }));

  const handleValueRemove = (val: string) =>
    setFilters((filters: Filters) => ({
      ...filters,
      tags: filters.tags.filter((v) => v !== val),
    }));

  const values = filters.tags.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {item}
    </Pill>
  ));

  const topicCloud = useMemo(() => {
    const topics = repositories.reduce(
      (acc, repo) => [...acc, ...repo.repository.topics],
      [] as string[]
    );
    const cloud = topics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(cloud).sort((a, b) => b[1] - a[1]);
  }, [repositories]);

  const options = topicCloud
    .filter(([topic]) => topic.includes(search.trim()))
    .map(([topic, count]) => (
      <Combobox.Option
        value={topic}
        key={topic}
        active={filters.tags.includes(topic)}
      >
        <Group gap="sm">
          {filters.tags.includes(topic) ? <CheckIcon size={12} /> : null}
          <span>
            {topic} ({count})
          </span>
        </Group>
      </Combobox.Option>
    ));

  const point = <IconPoint size={10} style={{ marginTop: 6 }} stroke={1.5} />;

  return (
    <Container
      className={classes.navbar}
      style={{
        position: "sticky",
        top: 65,
        zIndex: 10,
        height: "95vh",
        maxWidth: "25vw",
        padding: "30px",
      }}
    >
      <Group justify="space-between">
        <Text mb="md">Filters</Text>
        <Tooltip label="Reset Filter" withArrow position="right">
          <ActionIcon
            variant="transparent"
            size={20}
            onClick={() =>
              setFilters((filters: Filters) => ({
                ...filters,
                query: "", tags: [],
                minStars: originalMinStars,
                maxStars: originalMaxStars,
                minPrice: originalMinPrice,
                maxPrice: originalMaxPrice,
                placement: { readme: true, website: true },
              }))
            }
          >
            <IconRestore size={16} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Group gap="md" className={classes.section}>
        <Group align="center" justify="center" className={classes.collectionsHeader}>
          <Checkbox
            classNames={{ root: classes.checkbox }}
            label="Readme"
            checked={filters.placement.readme}
            onChange={(event) => setFilters((filters: Filters) => ({
              ...filters,
              placement: {
                ...filters.placement,
                readme: event.currentTarget.checked,
              },
            }))}
            wrapperProps={{
              onClick: () => setFilters((filters: Filters) => ({
                ...filters,
                placement: {
                  ...filters.placement,
                  readme: !filters.placement.readme,
                },
              })),
            }}
          />
          <Checkbox
            classNames={{ root: classes.checkbox }}
            label="Website"
            checked={filters.placement.website}
            onChange={(event) => setFilters((filters: Filters) => ({
              ...filters,
              placement: {
                ...filters.placement,
                website: event.currentTarget.checked,
              },
            }))}
            wrapperProps={{
              onClick: () => setFilters((filters: Filters) => ({
                ...filters,
                placement: {
                  ...filters.placement,
                  website: !filters.placement.website,
                },
              })),
            }}
          />
        </Group>
      </Group>

      <Group gap="md" className={classes.section}>
        <Stack className={classes.collectionsHeader}>
          <Text size="xs" fw={500}>
            Minimum Price
          </Text>

          <Group>
            <RangeSlider
              min={originalMinPrice}
              max={originalMaxPrice}
              w="100%"
              defaultValue={[minPrice, maxPrice]}
              value={[filters.minPrice, filters.maxPrice]}
              label={(number) => `$${nFormatter(number)}`}
              onChange={(values) => {
                setFilters((filters: Filters) => ({
                  ...filters,
                  minPrice: values[0],
                  maxPrice: values[1],
                }));
              }}
              thumbChildren={<IconGripVertical size={20} stroke={1.5} />}
              marks={[
                {
                  value: originalMinPrice,
                  label: `$${nFormatter(originalMinPrice)}`,
                },
                {
                  value:
                    originalMinPrice +
                    0.25 * (originalMaxPrice - originalMinPrice),
                  label: point,
                },
                {
                  value:
                    originalMinPrice +
                    0.5 * (originalMaxPrice - originalMinPrice),
                  label: `$${nFormatter(
                    originalMinPrice +
                      0.5 * (originalMaxPrice - originalMinPrice)
                  )}`,
                },
                {
                  value:
                    originalMinPrice +
                    0.75 * (originalMaxPrice - originalMinPrice),
                  label: point,
                },
                {
                  value: originalMaxPrice,
                  label: `$${nFormatter(originalMaxPrice)}`,
                },
              ]}
            />
          </Group>
        </Stack>

        <Stack className={classes.collectionsHeader}>
          <Text size="xs" fw={500}>
            Repository Stars
          </Text>

          <Group>
            <RangeSlider
              min={originalMinStars}
              max={originalMaxStars}
              w="100%"
              defaultValue={[minStars, maxStars]}
              value={[filters.minStars, filters.maxStars]}
              label={(number) => nFormatter(number)}
              onChange={(values) => {
                setFilters((filters: Filters) => ({
                  ...filters,
                  minStars: values[0],
                  maxStars: values[1],
                }));
              }}
              // thumbChildren={<IconGripVertical size={20} stroke={1.5} />}
              marks={[
                {
                  value: originalMinStars,
                  label: nFormatter(originalMinStars),
                },
                {
                  value:
                    originalMinStars +
                    0.25 * (originalMaxStars - originalMinStars),
                  label: point,
                },
                {
                  value:
                    originalMinStars +
                    0.5 * (originalMaxStars - originalMinStars),
                  label: nFormatter(
                    originalMinStars +
                      0.5 * (originalMaxStars - originalMinStars)
                  ),
                },
                {
                  value:
                    originalMinStars +
                    0.75 * (originalMaxStars - originalMinStars),
                  label: point,
                },
                {
                  value: originalMaxStars,
                  label: nFormatter(originalMaxStars),
                },
              ]}
            />
          </Group>
        </Stack>

        <Stack className={classes.collectionsHeader}>
          <Text size="xs" fw={500}>
            Repository Topics
          </Text>

          <Group>
            <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
              <Combobox.DropdownTarget>
                <PillsInput onClick={() => combobox.openDropdown()} w="100%">
                  <Pill.Group>
                    {values}
                    <Combobox.EventsTarget>
                      <PillsInput.Field
                        onFocus={() => combobox.openDropdown()}
                        onBlur={() => combobox.closeDropdown()}
                        value={search}
                        placeholder="Search values"
                        onChange={(event) => {
                          combobox.updateSelectedOptionIndex();
                          setSearch(event.currentTarget.value);
                        }}
                        onKeyDown={(event) => {
                          if (
                            event.key === "Backspace" &&
                            search.length === 0
                          ) {
                            event.preventDefault();
                            handleValueRemove(
                              filters.tags[filters.tags.length - 1]
                            );
                          }
                        }}
                      />
                    </Combobox.EventsTarget>
                  </Pill.Group>
                </PillsInput>
              </Combobox.DropdownTarget>

              <Combobox.Dropdown
                style={{ maxHeight: "300px", overflow: "scroll" }}
              >
                <Combobox.Options>
                  {options.length > 0 ? (
                    options
                  ) : (
                    <Combobox.Empty>Nothing found...</Combobox.Empty>
                  )}
                </Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>
          </Group>
        </Stack>
      </Group>
    </Container>
  );
}
