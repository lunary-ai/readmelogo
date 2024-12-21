import { useEffect, useMemo, useState } from "react";
import {
  IconGripVertical,
  IconPoint,
  IconRestore,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Checkbox,
  CheckIcon,
  Combobox,
  Container,
  Flex,
  Group,
  Pill,
  PillsInput,
  RangeSlider,
  Slider,
  Stack,
  Text,
  Tooltip,
  useCombobox,
} from "@mantine/core";
import { nFormatter } from "../utils/formatter";
import classes from "../styles/sidebar.module.css";

import type { Filters, Repository, SidebarProps } from "../types";

function calculateStars(results: Repository[]): [number, number] {
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

function calculatePrice(results: Repository[]): [number, number] {
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

  // Kept for usage when resetting filters and in the filters section
  // since it is not updated when the filters are updated
  const [originalMinStars, originalMaxStars] = calculateStars(repositories);
  const [originalMinPrice, originalMaxPrice] = calculatePrice(repositories);

  const [minStars, maxStars] = useMemo(
    () => calculateStars(results),
    [results]
  );

  const [, maxPrice] = useMemo(
    () => calculatePrice(results),
    [results]
  );

  // Update the default max price filter from Infinity
  useEffect(() => {
    setFilters((filters: Filters) => ({
      ...filters,
      maxPrice: originalMaxPrice,
    }));
  }, []);

  // Used for the topic search
  const [search, setSearch] = useState("");
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex("active"),
  });

  const handleValueSelect = (val: string) =>
    setFilters((filters: Filters) => ({
      ...filters,
      tags: filters.tags.includes(val)
        ? filters.tags.filter((v) => v !== val)
        : [...filters.tags, val],
    }));

  const handleValueRemove = (val: string | undefined) =>
    setFilters((filters: Filters) => ({
      ...filters,
      tags: filters.tags.filter((v) => v !== val),
    }));

  const tags = filters.tags.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {item}
    </Pill>
  ));

  // Array of [topic, count] pairs
  const topicCloud: Array<[string, number]> = useMemo(() => {
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
    <Container className={classes.navbar}>
      <Group justify="space-between" align="center">
        <Text mb="md" size="lg">Filters</Text>
        <Tooltip label="Reset Filter" withArrow position="right">
          <ActionIcon
            variant="transparent"
            size="lg"
            onClick={() =>
              setFilters((filters: Filters) => ({
                ...filters, query: "", tags: [],
                minStars: originalMinStars,
                maxStars: originalMaxStars,
                maxPrice: originalMaxPrice,
                placement: { readme: true, website: true },
              }))
            }
          >
            <IconRestore size="md" />
          </ActionIcon>
        </Tooltip>
      </Group>

      <Flex gap="md" className={classes.section}>
        <Flex
          align="center"
          gap="sm"
          className={classes.collectionsHeader}
        >
          <Checkbox
            classNames={{ root: classes.checkbox }}
            label="Readme"
            checked={filters.placement.readme}
            onChange={(event) =>
              setFilters((filters: Filters) => ({
                ...filters,
                placement: {
                  ...filters.placement,
                  readme: event.currentTarget.checked,
                },
              }))
            }
            wrapperProps={{
              onClick: () =>
                setFilters((filters: Filters) => ({
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
            onChange={(event) =>
              setFilters((filters: Filters) => ({
                ...filters,
                placement: {
                  ...filters.placement,
                  website: event.currentTarget.checked,
                },
              }))
            }
            wrapperProps={{
              onClick: () =>
                setFilters((filters: Filters) => ({
                  ...filters,
                  placement: {
                    ...filters.placement,
                    website: !filters.placement.website,
                  },
                })),
            }}
          />
        </Flex>

        <Stack className={classes.collectionsHeader}>
          <Text size="xs" fw={500}>
            Maximum Price
          </Text>

          <Group>
            <Slider
              max={originalMaxPrice}
              w="100%"
              defaultValue={maxPrice}
              value={filters.maxPrice}
              label={(number) => `$${nFormatter(number)}`}
              onChange={(maxPrice) => {
                setFilters((filters: Filters) => ({
                  ...filters, maxPrice,
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
                    {tags}
                    <Combobox.EventsTarget>
                      <PillsInput.Field
                        value={search}
                        placeholder="Search values"
                        onFocus={() => combobox.openDropdown()}
                        onBlur={() => combobox.closeDropdown()}
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
                            handleValueRemove(filters.tags.at(-1));
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
      </Flex>
    </Container>
  );
}
