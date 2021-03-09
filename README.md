<p align="center">
    <img src="https://static.permafrost.dev/images/alpinejs-ray/alpinejs-ray-logo-600x300.png" alt="alpinejs-ray" height="200" style="block">
    <br><br>
    <code style="font-size:3.0rem;"><strong>alpinejs-ray</strong></code>
    <br><br>
</p>

<p align="center">
    <img src="https://shields.io/npm/v/alpinejs-ray" alt="npm version"> <img src="https://shields.io/github/license/permafrost-dev/alpinejs-ray" alt="license"> <img src="https://github.com/permafrost-dev/alpinejs-ray/workflows/Run%20Tests/badge.svg?branch=main" alt="test status"> <img src="https://codecov.io/gh/permafrost-dev/alpinejs-ray/branch/main/graph/badge.svg?token=YW2BTKSNEO"/>
    <br>
    <img src="https://shields.io/npm/dt/alpinejs-ray" alt="npm downloads"> <img src="https://data.jsdelivr.com/v1/package/npm/alpinejs-ray/badge?style=rounded" alt="jsdelivr downloads">
</p>

# alpinejs-ray

## Debug your Alpine.js code with Ray to fix problems faster

This package can be installed into any project using alpine.js to send messages to the [Ray app](https://myray.app).

![screenshot](https://static.permafrost.dev/images/alpinejs-ray/screenshot-01.png)

## Installation via CDN

The preferred way to use this package is to load it via a CDN.  You'll need to load the `axios` library as well:

```html
<script src="https://cdn.jsdelivr.net/npm/axios@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/alpinejs-ray@latest/dist/standalone.min.js"></script>
```

## Installation with package bundlers

Install with npm:

```bash
npm install alpinejs-ray
```

or yarn:

```bash
yarn add alpinejs-ray
```

#### Importing the plugin

Although not the recommended way, you can import package normally:

```js 
import AlpineRayPlugin from 'alpinejs-ray';

// the plugin must be initialized:
AlpineRayPlugin.init();
```

### Configuration options

To configure `alpinejs-ray`, you must create an `alpineRayConfig` property on the `window` object before loading `alpinejs-ray`:

```html
<script>
    window.alpineRayConfig = {
        logComponentsInit: true,
    };
</script>

<!-- load axios and alpinejs-ray scripts here -->
```

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `logComponentsInit` | `boolean` | `false` | Send info on component initializations to Ray |
| `logCustomEvents` | `boolean` | `false` | Send info on custom events to Ray _(events with hyphenated names)_ |

## Usage

Once the plugin is installed, you may access the `$ray()` method within your components.

See the [node-ray reference](https://github.com/permafrost-dev/node-ray#reference) for a full list of available methods.

## Example Components

```html
<button @click="$ray('hello from alpine')">Send to Ray</button>
```

```html
<div x-data="onClickData()" x-init="init()">
    <div x-show="show">Hi There Ray!</div>

    <button x-on:click="toggle()">Show/Hide (Ray)</button>
</div>

<script>        
function onClickData() {
    return {
        init() {
            this.$ray().html('<strong>init on-click-ray data</strong>');
        },
        toggle() {
            this.show = !this.show;
            this.$ray('toggled show value to ' + (this.show ? 'true' : 'false'));
        },
        show: false,
    };
}
</script>
```

## Development setup

- `npm install`
- `npm run test`
- `npm run build:all`

## Testing

`alpinejs-ray` uses Jest for unit tests.  To run the test suite:

`npm run test`

---

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Security Vulnerabilities

Please review [our security policy](../../security/policy) on how to report security vulnerabilities.

## Credits

- [Patrick Organ](https://github.com/patinthehat)
- [All Contributors](../../contributors)

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.
