<?php

namespace ADS\TakeHome;

include __DIR__ . "/../vendor/autoload.php";

use ADS\TakeHome\Controllers\ExampleController;
use ADS\TakeHome\Framework\MySQL;
use ADS\TakeHome\Framework\Router;

$router = new Router();

$mysql = new MySQL("db", "weather", "root", "root");
$helloController = new ExampleController(greeting: "Hello", db: $mysql);

$router->addRoute("GET", "/hello", $helloController->sayHello(...));
$router->addRoute("GET", "/budapest", $helloController->getBudapestMaxTempCount(...));
$router->addRoute("GET", "/city-weather", $helloController->getCityWeather(...));
$router->addRoute("GET", "/region-weather", $helloController->getRegionWeather(...));
// TODO: többi végpont

$router->handleRequest();
