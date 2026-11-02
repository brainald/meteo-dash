<?php

declare(strict_types=1);

namespace ADS\TakeHome\Controllers;

use ADS\TakeHome\Framework\HttpRequest;
use ADS\TakeHome\Framework\HttpResponseInterface;
use ADS\TakeHome\Framework\JsonHttpResponse;
use ADS\TakeHome\Framework\MySQL;

class WeatherController
{
    public function __construct(
        private readonly MySQL $db,
    ) {
    }

    public function getCityWeather(HttpRequest $request): HttpResponseInterface
    {
        $cityId = $request->query["cityId"] ?? null;
        $startDate = $request->query["startDate"] ?? null;
        $endDate = $request->query["endDate"] ?? null;

        if (
            !is_string($cityId)
            || filter_var($cityId, FILTER_VALIDATE_INT, ["options" => ["min_range" => 1]]) === false
        ) {
            return new JsonHttpResponse(["error" => "'cityId' pozitív egész számként kötelező"], 400);
        }

        $startDateValue = $this->parseDate($startDate);
        $endDateValue = $this->parseDate($endDate);
        if ($startDateValue === null || $endDateValue === null) {
            return new JsonHttpResponse(
                ["error" => "'startDate' és 'endDate' dátumként kötelező (YYYY-MM-DD)"],
                400,
            );
        }
        if ($startDateValue > $endDateValue) {
            return new JsonHttpResponse(["error" => "'startDate' nem lehet későbbi, mint az 'endDate'"], 400);
        }

        $pagination = $this->parsePagination($request);
        if ($pagination === null) {
            return new JsonHttpResponse(["error" => "Érvénytelen lapozási paraméterek"], 400);
        }

        $baseQuery = "SELECT
                DATE_FORMAT(STR_TO_DATE(maximum_temperatures.date, '%Y%m%d'), '%Y-%m-%d') AS `date`,
                minimum_temperatures.min_temp AS `minTemp`,
                maximum_temperatures.max_temp AS `maxTemp`,
                ROUND((minimum_temperatures.min_temp + maximum_temperatures.max_temp) / 2, 2) AS `averageTemp`,
                precipitation.precipitation AS `precipitation`
            FROM weather.maximum_temperatures
            INNER JOIN weather.minimum_temperatures
                ON minimum_temperatures.city_id = maximum_temperatures.city_id
                AND minimum_temperatures.date = maximum_temperatures.date
            INNER JOIN weather.precipitation
                ON precipitation.city_id = maximum_temperatures.city_id
                AND precipitation.date = maximum_temperatures.date
            WHERE maximum_temperatures.city_id = :cityId
                AND maximum_temperatures.date BETWEEN :startDate AND :endDate";
        $queryParams = [
            ":cityId" => (int)$cityId,
            ":startDate" => $startDateValue,
            ":endDate" => $endDateValue,
        ];

        $summaryRows = $this->getWeatherSummary($baseQuery, $queryParams);
        $rows = $this->db->queryAssoc(
            "SELECT *
            FROM ({$baseQuery}) AS cityWeather
            ORDER BY `date`
            LIMIT :limit OFFSET :offset",
            [
                ...$queryParams,
                ":limit" => $pagination["limit"],
                ":offset" => $pagination["offset"],
            ],
        );

        return new JsonHttpResponse([
            "data" => $rows,
            ...$pagination,
            "total" => $summaryRows["total"],
            "summary" => [
                "warmestDay" => $summaryRows["warmestDay"],
                "coolestDay" => $summaryRows["coolestDay"],
                "wettestDay" => $summaryRows["wettestDay"],
            ],
        ]);
    }

    public function getRegionWeather(HttpRequest $request): HttpResponseInterface
    {
        $region = $request->query["region"] ?? null;
        $startDate = $request->query["startDate"] ?? null;
        $endDate = $request->query["endDate"] ?? null;

        if (
            !is_string($region)
            || !in_array($region, ["Dunántúl", "Közép-Magyarország", "Észak és Alföld"], true)
        ) {
            return new JsonHttpResponse(["error" => "'region' érvényes régióként kötelező"], 400);
        }

        $startDateValue = $this->parseDate($startDate);
        $endDateValue = $this->parseDate($endDate);
        if ($startDateValue === null || $endDateValue === null) {
            return new JsonHttpResponse(
                ["error" => "'startDate' és 'endDate' dátumként kötelező (YYYY-MM-DD)"],
                400,
            );
        }
        if ($startDateValue > $endDateValue) {
            return new JsonHttpResponse(["error" => "'startDate' nem lehet későbbi, mint az 'endDate'"], 400);
        }

        $pagination = $this->parsePagination($request);
        if ($pagination === null) {
            return new JsonHttpResponse(["error" => "Érvénytelen lapozási paraméterek"], 400);
        }

        $baseQuery = "SELECT
                DATE_FORMAT(STR_TO_DATE(maximum_temperatures.date, '%Y%m%d'), '%Y-%m-%d') AS `date`,
                ROUND(AVG(minimum_temperatures.min_temp), 2) AS `minTemp`,
                ROUND(AVG(maximum_temperatures.max_temp), 2) AS `maxTemp`,
                ROUND(AVG((minimum_temperatures.min_temp + maximum_temperatures.max_temp) / 2), 2) AS `averageTemp`,
                ROUND(AVG(precipitation.precipitation), 2) AS `precipitation`
            FROM weather.cities
            INNER JOIN weather.maximum_temperatures
                ON maximum_temperatures.city_id = cities.id
            INNER JOIN weather.minimum_temperatures
                ON minimum_temperatures.city_id = maximum_temperatures.city_id
                AND minimum_temperatures.date = maximum_temperatures.date
            INNER JOIN weather.precipitation
                ON precipitation.city_id = maximum_temperatures.city_id
                AND precipitation.date = maximum_temperatures.date
            WHERE cities.region = :region
                AND maximum_temperatures.date BETWEEN :startDate AND :endDate
            GROUP BY maximum_temperatures.date
            ";
        $queryParams = [
            ":region" => $region,
            ":startDate" => $startDateValue,
            ":endDate" => $endDateValue,
        ];

        $summaryRows = $this->getWeatherSummary($baseQuery, $queryParams);
        $rows = $this->db->queryAssoc(
            "SELECT *
            FROM ({$baseQuery}) AS regionWeather
            ORDER BY `date`
            LIMIT :limit OFFSET :offset",
            [
                ...$queryParams,
                ":limit" => $pagination["limit"],
                ":offset" => $pagination["offset"],
            ],
        );

        return new JsonHttpResponse([
            "data" => $rows,
            ...$pagination,
            "total" => $summaryRows["total"],
            "summary" => [
                "warmestDay" => $summaryRows["warmestDay"],
                "coolestDay" => $summaryRows["coolestDay"],
                "wettestDay" => $summaryRows["wettestDay"],
            ],
        ]);
    }

    public function getCityOptions(): HttpResponseInterface
    {
        $rows = $this->db->queryAssoc(
            "SELECT id, name, region
            FROM weather.cities
            ORDER BY name, region",
        );

        return new JsonHttpResponse($rows);
    }

    public function getRegionOptions(): HttpResponseInterface
    {
        $rows = $this->db->queryAssoc(
            "SELECT DISTINCT region
            FROM weather.cities
            ORDER BY region",
        );

        return new JsonHttpResponse(array_column($rows, "region"));
    }

    public function getMonitoredCities(): HttpResponseInterface
    {
        $rows = $this->db->queryAssoc(
            "SELECT COUNT(*) AS `count`
            FROM weather.cities",
        );

        return new JsonHttpResponse(["count" => (int)$rows[0]["count"]]);
    }

    public function getCoveredRegions(): HttpResponseInterface
    {
        $rows = $this->db->queryAssoc(
            "SELECT COUNT(DISTINCT region) AS `count`
            FROM weather.cities",
        );

        return new JsonHttpResponse(["count" => (int)$rows[0]["count"]]);
    }

    public function getHighestTemperature(): HttpResponseInterface
    {
        $rows = $this->db->queryAssoc(
            "SELECT
                maximum_temperatures.max_temp AS `temperature`,
                cities.name AS `city`,
                DATE_FORMAT(STR_TO_DATE(maximum_temperatures.date, '%Y%m%d'), '%Y-%m-%d') AS `date`
            FROM weather.maximum_temperatures
            INNER JOIN weather.cities
                ON cities.id = maximum_temperatures.city_id
            ORDER BY maximum_temperatures.max_temp DESC, maximum_temperatures.date ASC, cities.id ASC
            LIMIT 1",
        );

        return new JsonHttpResponse($rows[0] ?? null);
    }

    private function parseDate(mixed $date): int|null
    {
        if (!is_string($date) || preg_match('/^\d{4}-\d{2}-\d{2}$/D', $date) !== 1) {
            return null;
        }

        $parsedDate = \DateTimeImmutable::createFromFormat("!Y-m-d", $date);
        if ($parsedDate === false || $parsedDate->format("Y-m-d") !== $date) {
            return null;
        }

        return (int)$parsedDate->format("Ymd");
    }

    /**
     * @return array{page: int, limit: int, offset: int}|null
     */
    private function parsePagination(HttpRequest $request): array|null
    {
        $page = $this->parseIntegerQuery($request->query["page"] ?? null, 1, 1, PHP_INT_MAX);
        $limit = $this->parseIntegerQuery($request->query["limit"] ?? null, 10, 1, 100);
        if ($page === null || $limit === null || ($page - 1) > intdiv(PHP_INT_MAX, $limit)) {
            return null;
        }

        $calculatedOffset = ($page - 1) * $limit;
        $offset = $this->parseIntegerQuery(
            $request->query["offset"] ?? null,
            $calculatedOffset,
            0,
            PHP_INT_MAX,
        );
        if ($offset === null || $offset !== $calculatedOffset) {
            return null;
        }

        return [
            "page" => $page,
            "limit" => $limit,
            "offset" => $offset,
        ];
    }

    private function parseIntegerQuery(mixed $value, int $default, int $min, int $max): int|null
    {
        if ($value === null) {
            return $default;
        }
        if (!is_string($value) || preg_match('/^\d+$/D', $value) !== 1) {
            return null;
        }

        $integer = filter_var(
            $value,
            FILTER_VALIDATE_INT,
            ["options" => ["min_range" => $min, "max_range" => $max]],
        );

        return is_int($integer) ? $integer : null;
    }

    /**
     * @param array<string, scalar|null> $params
     * @return array{
     *     total: int,
     *     warmestDay: array{date: string, value: float}|null,
     *     coolestDay: array{date: string, value: float}|null,
     *     wettestDay: array{date: string, value: float}|null
     * }
     */
    private function getWeatherSummary(string $baseQuery, array $params): array
    {
        $rows = $this->db->queryAssoc(
            "SELECT
                COUNT(*) AS `total`,
                MAX(`maxTemp`) AS `warmestValue`,
                SUBSTRING_INDEX(GROUP_CONCAT(`date` ORDER BY `maxTemp` DESC, `date` ASC), ',', 1) AS `warmestDate`,
                MIN(`minTemp`) AS `coolestValue`,
                SUBSTRING_INDEX(GROUP_CONCAT(`date` ORDER BY `minTemp` ASC, `date` ASC), ',', 1) AS `coolestDate`,
                MAX(`precipitation`) AS `wettestValue`,
                SUBSTRING_INDEX(GROUP_CONCAT(`date` ORDER BY `precipitation` DESC, `date` ASC), ',', 1) AS `wettestDate`
            FROM ({$baseQuery}) AS weatherSummary",
            $params,
        );

        $row = $rows[0];

        return [
            "total" => (int)$row["total"],
            "warmestDay" => $row["warmestDate"] === null
                ? null
                : ["date" => (string)$row["warmestDate"], "value" => (float)$row["warmestValue"]],
            "coolestDay" => $row["coolestDate"] === null
                ? null
                : ["date" => (string)$row["coolestDate"], "value" => (float)$row["coolestValue"]],
            "wettestDay" => $row["wettestDate"] === null
                ? null
                : ["date" => (string)$row["wettestDate"], "value" => (float)$row["wettestValue"]],
        ];
    }
}
