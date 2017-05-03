## Requirement

[nodejs](https://nodejs.org/en/)

[bower](https://bower.io/)

[gulpjs](http://gulpjs.com/)

## Installation

```
npm install
bower install
```

## Development

- Start by `gulp serve`

- Head to [http://localhost:3000](http://localhost:3000) (Be sure that you are using the magic lab network)

- Note that the python scripts are for running on the pepper robot. However you can locally run `camera_stream_server.py`, just change the `HOST_NAME` to `localhost`

- Coding style follows [John Papa's Angular 1 Style Guide](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md)

## Deployment

run `gulp`, then copy `dist/` folder to pepper's `/home/nao/web-tools` 