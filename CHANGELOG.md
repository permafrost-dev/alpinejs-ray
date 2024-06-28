# Changelog

All notable changes to `permafrost-dev/alpinejs-ray` will be documented in this file.

---

## 2.1.0 - 2024-Jun-28

- fixing errors to ray
- updated readme for handling errors

## 2.0.0 - 2022-03-09

- drop support for Alpine v2
- add support for Alpine v3
- drop Spruce support
- major code cleanup and refactoring
- dependency version updates

## 1.4.0 - 2021-03-13

- add `SpruceRay.spruce()` method to access an object for watching/unwatching Spruce store properties

- add additional tests

## 1.3.0 - 2021-03-12

- add `bootstrapImports()` helper to reduce boilerplate code when importing for use with a bundler

- fix issue with `SpruceProxy.displayTracking()` not finding the `ray()` helper

## 1.2.0 - 2021-03-09

- add interception and display for errors in alpine components

- add initial [Spruce](https://github.com/ryangjchandler/spruce) data tracking

- code cleanup

## 1.1.1 - 2021-03-06

- update `node-ray` package to `v1.10.1`

## 1.1.0 - 2021-03-06

- improve syntax highlighting for components

- add `logCustomEvents` config option

- send custom events to Ray when `logCustomEvents` is `true`

## 1.0.0 - 2021-03-05

- initial release
