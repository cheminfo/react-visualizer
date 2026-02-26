# Changelog

## [5.0.1](https://github.com/cheminfo/react-visualizer/compare/v5.0.0...v5.0.1) (2026-02-26)


### Bug Fixes

* properly publish bin ([e78980d](https://github.com/cheminfo/react-visualizer/commit/e78980d801e1a28d4de43e030d192136be500770))

## [5.0.0](https://github.com/cheminfo/react-visualizer/compare/v4.1.0...v5.0.0) (2026-02-26)


### ⚠ BREAKING CHANGES

* the `version` prop was removed. Either construct visualizer.html page with appropriate `loadversion` and `fallbackVersion` options, or use the new `queryParameters` prop to customize the behaviour.

### Features

* rework Visualizer components API ([0ab1d4c](https://github.com/cheminfo/react-visualizer/commit/0ab1d4cb25238a8010941dc6682a90e58fcc6254))


### Bug Fixes

* make sure makeVisualizerPage can be used properly with npx ([f44b6a7](https://github.com/cheminfo/react-visualizer/commit/f44b6a7791bd6419e961366aa52ed61d113a3698))

## [4.1.0](https://github.com/cheminfo/react-visualizer/compare/v4.0.0...v4.1.0) (2026-02-25)


### Features

* decide of a default loadversion parameter when making the visualizer page ([#25](https://github.com/cheminfo/react-visualizer/issues/25)) ([e150ef3](https://github.com/cheminfo/react-visualizer/commit/e150ef312f18f9980aa45c4c7c1885c95a223e65))

## [4.0.0](https://github.com/cheminfo/react-visualizer/compare/v3.0.1...v4.0.0) (2026-02-25)


### ⚠ BREAKING CHANGES

* stop supporting very old browsers which do not support fetch or URL

### Features

* new load strategy latest-major ([#21](https://github.com/cheminfo/react-visualizer/issues/21)) ([eb93b08](https://github.com/cheminfo/react-visualizer/commit/eb93b08b4a695330561d31f1ed665226cfb8cc16))
