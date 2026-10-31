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
    ) {}

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

        $rows = $this->db->queryAssoc(
            "SELECT
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
                AND maximum_temperatures.date BETWEEN :startDate AND :endDate
            ORDER BY maximum_temperatures.date",
            [
                ":cityId" => (int)$cityId,
                ":startDate" => $startDateValue,
                ":endDate" => $endDateValue,
            ],
        );

        return new JsonHttpResponse($rows);
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

        $rows = $this->db->queryAssoc(
            "SELECT
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
            ORDER BY maximum_temperatures.date",
            [
                ":region" => $region,
                ":startDate" => $startDateValue,
                ":endDate" => $endDateValue,
            ],
        );

        return new JsonHttpResponse($rows);
    }

    private function parseDate(string|array|null $date): int|null
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
}
