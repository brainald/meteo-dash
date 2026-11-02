<?php

declare(strict_types=1);

namespace ADS\TakeHome\Tests\Controllers;

use ADS\TakeHome\Controllers\WeatherController;
use ADS\TakeHome\Framework\HttpRequest;
use ADS\TakeHome\Framework\JsonHttpResponse;
use ADS\TakeHome\Framework\MySQL;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;

class WeatherControllerTest extends TestCase
{
    /** @var MySQL&MockObject */
    private MySQL $db;

    private WeatherController $controller;

    /**
     * @var list<array{sql: string, params: array<string, scalar|null>}>
     */
    private array $queries = [];

    /**
     * @var list<list<array<string, scalar|null>>>
     */
    private array $queryResults = [];

    protected function setUp(): void
    {
        $this->db = $this->getMockBuilder(MySQL::class)
            ->disableOriginalConstructor()
            ->onlyMethods(["queryAssoc"])
            ->getMock();
        $this->db->method("queryAssoc")
            ->willReturnCallback(function (string $sql, array $params = []): array {
                $this->queries[] = ["sql" => $sql, "params" => $params];
                return array_shift($this->queryResults) ?? [];
            });

        $this->controller = new WeatherController($this->db);
    }

    #[Test]
    public function cityWeatherReturnsPaginatedRecordsAndFullRangeSummary(): void
    {
        $this->queryResults = [
            [[
                "total" => "7",
                "warmestValue" => "18.5",
                "warmestDate" => "2023-12-29",
                "coolestValue" => "-4.25",
                "coolestDate" => "2023-12-03",
                "wettestValue" => "22",
                "wettestDate" => "2023-12-12",
            ]],
            [[
                "date" => "2023-12-06",
                "minTemp" => "-1.5",
                "maxTemp" => "4.5",
                "averageTemp" => "1.5",
                "precipitation" => "2",
            ]],
        ];

        $response = $this->controller->getCityWeather(new HttpRequest([
            "cityId" => "3",
            "startDate" => "2023-12-01",
            "endDate" => "2023-12-31",
            "page" => "2",
            "limit" => "5",
            "offset" => "5",
        ]));

        self::assertSame(200, $response->getStatus());
        self::assertSame([
            "data" => [[
                "date" => "2023-12-06",
                "minTemp" => "-1.5",
                "maxTemp" => "4.5",
                "averageTemp" => "1.5",
                "precipitation" => "2",
            ]],
            "page" => 2,
            "limit" => 5,
            "offset" => 5,
            "total" => 7,
            "summary" => [
                "warmestDay" => ["date" => "2023-12-29", "value" => 18.5],
                "coolestDay" => ["date" => "2023-12-03", "value" => -4.25],
                "wettestDay" => ["date" => "2023-12-12", "value" => 22],
            ],
        ], $this->decodeResponse($response));

        self::assertCount(2, $this->queries);
        self::assertStringContainsString(
            "maximum_temperatures.city_id = :cityId",
            $this->queries[0]["sql"],
        );
        self::assertSame([
            ":cityId" => 3,
            ":startDate" => 20231201,
            ":endDate" => 20231231,
        ], $this->queries[0]["params"]);
        self::assertSame([
            ":cityId" => 3,
            ":startDate" => 20231201,
            ":endDate" => 20231231,
            ":limit" => 5,
            ":offset" => 5,
        ], $this->queries[1]["params"]);
    }

    #[Test]
    public function regionWeatherAggregatesRecordsByDateAndReturnsEmptySummary(): void
    {
        $this->queryResults = [
            [[
                "total" => "0",
                "warmestValue" => null,
                "warmestDate" => null,
                "coolestValue" => null,
                "coolestDate" => null,
                "wettestValue" => null,
                "wettestDate" => null,
            ]],
            [],
        ];

        $response = $this->controller->getRegionWeather(new HttpRequest([
            "region" => "Dunántúl",
            "startDate" => "2023-12-01",
            "endDate" => "2023-12-31",
        ]));

        self::assertSame(200, $response->getStatus());
        self::assertSame([
            "data" => [],
            "page" => 1,
            "limit" => 10,
            "offset" => 0,
            "total" => 0,
            "summary" => [
                "warmestDay" => null,
                "coolestDay" => null,
                "wettestDay" => null,
            ],
        ], $this->decodeResponse($response));
        self::assertCount(2, $this->queries);
        self::assertStringContainsString("AVG(minimum_temperatures.min_temp)", $this->queries[0]["sql"]);
        self::assertStringContainsString("GROUP BY maximum_temperatures.date", $this->queries[0]["sql"]);
        self::assertSame([
            ":region" => "Dunántúl",
            ":startDate" => 20231201,
            ":endDate" => 20231231,
        ], $this->queries[0]["params"]);
    }

    #[Test]
    public function regionWeatherReturnsAggregatedRecordsForRequestedPage(): void
    {
        $this->queryResults = [
            [[
                "total" => "2",
                "warmestValue" => "12.5",
                "warmestDate" => "2023-12-02",
                "coolestValue" => "-3",
                "coolestDate" => "2023-12-01",
                "wettestValue" => "8.75",
                "wettestDate" => "2023-12-02",
            ]],
            [[
                "date" => "2023-12-02",
                "minTemp" => "1.25",
                "maxTemp" => "12.5",
                "averageTemp" => "6.88",
                "precipitation" => "8.75",
            ]],
        ];

        $response = $this->controller->getRegionWeather(new HttpRequest([
            "region" => "Észak és Alföld",
            "startDate" => "2023-12-01",
            "endDate" => "2023-12-31",
            "page" => "2",
            "limit" => "1",
            "offset" => "1",
        ]));

        self::assertSame(200, $response->getStatus());
        self::assertSame([
            "data" => [[
                "date" => "2023-12-02",
                "minTemp" => "1.25",
                "maxTemp" => "12.5",
                "averageTemp" => "6.88",
                "precipitation" => "8.75",
            ]],
            "page" => 2,
            "limit" => 1,
            "offset" => 1,
            "total" => 2,
            "summary" => [
                "warmestDay" => ["date" => "2023-12-02", "value" => 12.5],
                "coolestDay" => ["date" => "2023-12-01", "value" => -3],
                "wettestDay" => ["date" => "2023-12-02", "value" => 8.75],
            ],
        ], $this->decodeResponse($response));
        self::assertCount(2, $this->queries);
        self::assertSame(1, $this->queries[1]["params"][":limit"]);
        self::assertSame(1, $this->queries[1]["params"][":offset"]);
    }

    #[Test]
    public function cityWeatherUsesDefaultPaginationAndReturnsEmptyRange(): void
    {
        $this->queryResults = [
            [[
                "total" => "0",
                "warmestValue" => null,
                "warmestDate" => null,
                "coolestValue" => null,
                "coolestDate" => null,
                "wettestValue" => null,
                "wettestDate" => null,
            ]],
            [],
        ];

        $response = $this->controller->getCityWeather(new HttpRequest([
            "cityId" => "1",
            "startDate" => "2023-12-01",
            "endDate" => "2023-12-31",
        ]));

        self::assertSame(200, $response->getStatus());
        self::assertSame([
            "data" => [],
            "page" => 1,
            "limit" => 10,
            "offset" => 0,
            "total" => 0,
            "summary" => [
                "warmestDay" => null,
                "coolestDay" => null,
                "wettestDay" => null,
            ],
        ], $this->decodeResponse($response));
        self::assertCount(2, $this->queries);
        self::assertSame(10, $this->queries[1]["params"][":limit"]);
        self::assertSame(0, $this->queries[1]["params"][":offset"]);
    }

    #[Test]
    public function invalidCityIdAndDateAreRejectedWithoutQueryingDatabase(): void
    {
        $invalidCityId = $this->controller->getCityWeather(new HttpRequest([
            "cityId" => "0",
            "startDate" => "2023-12-01",
            "endDate" => "2023-12-31",
        ]));
        $invalidDate = $this->controller->getCityWeather(new HttpRequest([
            "cityId" => "1",
            "startDate" => "2023-02-30",
            "endDate" => "2023-12-31",
        ]));

        self::assertSame(400, $invalidCityId->getStatus());
        self::assertSame(400, $invalidDate->getStatus());
        self::assertCount(0, $this->queries);
    }

    #[Test]
    public function invalidRegionAndInconsistentPaginationAreRejected(): void
    {
        $invalidRegion = $this->controller->getRegionWeather(new HttpRequest([
            "region" => "Unknown",
            "startDate" => "2023-12-01",
            "endDate" => "2023-12-31",
        ]));
        $invalidPagination = $this->controller->getRegionWeather(new HttpRequest([
            "region" => "Dunántúl",
            "startDate" => "2023-12-01",
            "endDate" => "2023-12-31",
            "page" => "2",
            "limit" => "10",
            "offset" => "9",
        ]));

        self::assertSame(400, $invalidRegion->getStatus());
        self::assertSame(400, $invalidPagination->getStatus());
        self::assertCount(0, $this->queries);
    }

    #[Test]
    public function reversedDateRangeAndOutOfRangeLimitAreRejected(): void
    {
        $reversedDateRange = $this->controller->getCityWeather(new HttpRequest([
            "cityId" => "1",
            "startDate" => "2023-12-31",
            "endDate" => "2023-12-01",
        ]));
        $invalidLimit = $this->controller->getRegionWeather(new HttpRequest([
            "region" => "Dunántúl",
            "startDate" => "2023-12-01",
            "endDate" => "2023-12-31",
            "page" => "1",
            "limit" => "101",
            "offset" => "0",
        ]));

        self::assertSame(400, $reversedDateRange->getStatus());
        self::assertSame(400, $invalidLimit->getStatus());
        self::assertCount(0, $this->queries);
    }

    #[Test]
    public function locationAndHighlightEndpointsMapDatabaseResults(): void
    {
        $this->queryResults = [
            [["id" => 1, "name" => "Budapest", "region" => "Közép-Magyarország"]],
            [["region" => "Dunántúl"], ["region" => "Észak és Alföld"]],
            [["count" => "10"]],
            [["count" => "3"]],
            [[
                "temperature" => "41.3",
                "city" => "Budapest",
                "date" => "2023-07-20",
            ]],
        ];

        self::assertSame(
            [["id" => 1, "name" => "Budapest", "region" => "Közép-Magyarország"]],
            $this->decodeResponse($this->controller->getCityOptions()),
        );
        self::assertSame(
            ["Dunántúl", "Észak és Alföld"],
            $this->decodeResponse($this->controller->getRegionOptions()),
        );
        self::assertSame(
            ["count" => 10],
            $this->decodeResponse($this->controller->getMonitoredCities()),
        );
        self::assertSame(
            ["count" => 3],
            $this->decodeResponse($this->controller->getCoveredRegions()),
        );
        self::assertSame(
            ["temperature" => "41.3", "city" => "Budapest", "date" => "2023-07-20"],
            $this->decodeResponse($this->controller->getHighestTemperature()),
        );
        self::assertCount(5, $this->queries);
    }

    /**
     * @return mixed
     */
    private function decodeResponse(mixed $response): mixed
    {
        self::assertInstanceOf(JsonHttpResponse::class, $response);
        $body = $response->getBody();
        self::assertIsString($body);

        return json_decode($body, true, 512, JSON_THROW_ON_ERROR);
    }
}
