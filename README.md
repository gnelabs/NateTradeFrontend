# NateTradeFrontend
Frontend website package for NateTrade.

## Development

### Testing and Debugging

``` bash
# Run tests to make sure it will compile. Thats all the tests do, but its an easy way to check project-wide.
$ npm run test
# Hit A for all tests. Q to quit once its ran.
```

This will run a dev server. 

``` bash
# dev server  with hot reload at http://localhost:3000
$ npm run start
```

### Building for production

Build for production using webpack.

```bash
# build for production with minification
$ npm run build
```

Zip it for deployment with the NateTrade package. (windows version)

```bash
# Will create a website.zip file to copy over.
$ npm run zip
```