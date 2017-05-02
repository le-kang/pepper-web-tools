## Requirement

[nodejs](https://nodejs.org/en/)
[gulpjs](http://gulpjs.com/)

## Installation

```
npm install
bower install
```

## Development

- Start

    ```
    gulp serve
    ```

- Head to [http://localhost:3000](http://localhost:3000)

- Note that the python scripts are for running at robot. However you can locally run `camera_stream_server`, just change the `HOST_NAME` to `localhost`

## Deployment

run `gulp`, then copy `dist/` folder to pepper's `/home/nao/web-tools` 