# Uptime

Simple uptime service to monitor websites. The cron runs every minute and sends an email when the requested service is not available (http status code 200).

## Getting Started

* Create `.env` file and provide necessary values (see .env.example)
* Create `uptime-config.json` file and provice necessary values (see uptime-config.json.example)
* Run the following commands:

```sh
pnpm install
pnpm build
pnpm start
```

## License

Project is created under the [MIT License](./LICENSE)
