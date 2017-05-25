## Requirement

[nodejs](https://nodejs.org/en/)

[bower](https://bower.io/)

[gulpjs](http://gulpjs.com/)

## Installation

```
npm install
bower install
cd app/bower_components/CodeMirror/ && npm install
cd ../acorn/ && npm install
```

## Development

- Start by `gulp serve`

- Head to [http://localhost:3000](http://localhost:3000) (Be sure that you are using the magic lab network)

- Coding style follows [John Papa's Angular 1 Style Guide](https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md)

## Deployment

run `gulp`, then `scp -r dist/ nao@pepper.local:/home/nao/web_tools/` 