# Adiumsoft PHP / React Practical Assignment

## Preparation

Install the following software:

- [Docker](https://docs.docker.com/get-started/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- `git` in any form (for example, [Git Bash](https://git-scm.com/downloads/win))

The commands in the rest of this guide are designed for `bash` and should work correctly in Bash. You can use `cmd`, PowerShell, or another shell, but you will probably need to adjust the commands accordingly.

Create the `.env` file, which contains the Docker container settings:

```sh
cd takehome
cp .env.example .env
```

## Assignment

During this assignment, you will build a full-stack application that generates reports from meteorological data. The subtasks can be completed in any order. The final result will be checked by building and starting the `prod` and `db` Docker containers and by reviewing the source code. Submit the assignment only after verifying that the following command runs successfully:

```sh
docker compose up prod db
```

The finished application will be available at `http://localhost:8300` and must work correctly. Modify only the contents of the `api/` and `client/` directories, the `db-suggestions.md` file, and, if necessary, the `docker-compose.yaml` file.

### Development Environment, Docker

Prepare the data required for the assignment. The data is located in the `migrations/` directory in the `data.zip` file. Extract its contents into the same directory. The files will be loaded automatically when the `db` container starts.

```sh
cd migrations
unzip data.zip
```

Start the Docker containers required for development:

```sh
docker compose up api-dev client-dev db
```

After startup, verify that the scripts installing external packages (`composer install` and `npm ci`) completed successfully. The Docker process must have write access to the `api/` and `client/` directories because the installation scripts write to them. If these directories are not writable, the scripts will not complete successfully. Look for console messages similar to the following (they do not necessarily appear consecutively):

```text
takehome-db          | [INFO] Successfully imported data from /docker-entrypoint-initdb.d/tx_o_Budapest_19012023.csv
takehome-db          | 2026-03-06T13:31:41.803028Z 0 [System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections.
takehome-client-dev  |   VITE v7.3.1  ready in 149 ms
takehome-client-dev  |
takehome-client-dev  |   ➜  Local:   http://localhost:5173/
takehome-api-dev     | 2026-03-06 13:31:45,850 INFO exited: composer-install (exit status 0; expected)
```

The `api-dev` container can be checked with:

```sh
curl localhost:8080/hello?name=guest
```

Response:

```json
{"message":"Hello, guest!"}
```

The `client-dev` container can be checked with:

```sh
curl localhost:5173
```

Response:

```html
<!doctype html>
<html lang="en">

<head>
<!-- and so on -->
```

If you cannot find the messages mentioned above, you receive responses other than those listed for the verification commands, or you encounter another error, report the problem to [hiring@adiumsoft.hu](mailto:hiring@adiumsoft.hu).

The sample data is stored in a MySQL database that is accessible from the host machine on port `8081`. The required username is `root`, and the password is also `root`. It can also be accessed from inside the container:

```sh
docker compose exec db sh -c 'mysql --user=root --******'
```

Use camelCase for variable, function, function parameter, and field names in the source code. Format class, type, and React component names using PascalCase.

### Server Side

On the server side, use PHP and the prepared [framework components](./api/src/Framework) to handle HTTP requests and database queries. Implement the following two endpoints:

1. Accept a city ID, start date, and end date as query parameters and return the city's weather data.

2. Accept a region name (for example, `Transdanubia`), start date, and end date as query parameters and return the averaged weather data for the cities in the specified region.

Using this data on the client side, create a table that displays the minimum, maximum, and average temperatures and precipitation data, each with the appropriate unit. Add the median and mode values for each column to the table footer.

The names of the endpoints and query parameters and the structure of the returned data are open to your choice, as the goal is to display the data. Endpoint responses must use JSON text.

Additional endpoints may be created if you consider them necessary.

### Client Side

On the client side, use the React library, the TypeScript language, and the Vite build system to create the UI. Create two views:

1. A view where the user can select a city and a start and end date. When a button is pressed, download the weather data for the selected city and period and display it in table format. The table columns must include the minimum, maximum, and average temperatures and precipitation data. Display the appropriate unit next to each value.

2. A view where the user can select a region and a start and end date. When a button is pressed, download the averaged weather data for the selected region and period and display it in table format. The table columns must include the minimum, maximum, and average temperatures and precipitation data. Display the appropriate unit next to each value.

Calculate the average temperature from the minimum and maximum temperature data.

The method for accessing the pages is flexible; you may use any routing library, such as [TanStack Router](https://tanstack.com/router/latest), or implement the pages without routing. Styling is also flexible, but the result must not use the browser's default appearance. Prefer the Tailwind CSS framework for styling, though plain CSS is also acceptable.

### Extra Tasks

These tasks are optional, but they provide an opportunity to demonstrate deeper knowledge of the technologies.

1. Allow users to switch between SI and imperial units in the interface (Celsius and Fahrenheit, millimeters and inches).

2. Write automated server-side tests using PHPUnit.

3. Examine the database structure and contents. Formulate suggestions for parts that appear incorrect or could be improved, and record them in `db-suggestions.md`.

4. Use the PHP source formatter and static analysis commands (`composer format`, `composer analyse`). Fix any errors reported by the static analyzer.
