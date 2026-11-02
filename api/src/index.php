<?php

namespace ADS\TakeHome;

include __DIR__ . "/../vendor/autoload.php";

use ADS\TakeHome\Controllers\WeatherController;
use ADS\TakeHome\Framework\MySQL;
use ADS\TakeHome\Framework\Router;

$router = new Router();

$mysql = new MySQL("db", "weather", "root", "root");
$weatherController = new WeatherController(db: $mysql);

$router->addRoute("GET", "/highlights/monitored-cities", $weatherController->getMonitoredCities(...));
$router->addRoute("GET", "/highlights/covered-regions", $weatherController->getCoveredRegions(...));
$router->addRoute("GET", "/highlights/highest-temperature", $weatherController->getHighestTemperature(...));
$router->addRoute("GET", "/city-weather", $weatherController->getCityWeather(...));
$router->addRoute("GET", "/region-weather", $weatherController->getRegionWeather(...));

$router->handleRequest();
