# Docker

Run honk from the `ghcr.io/daeuniverse/honk` image on [GitHub Container Registry](https://github.com/daeuniverse/honk/pkgs/container/honk). honk's [Run with Docker](../how-to-start.md#run-with-docker) covers the host requirements, the repository's `docker-compose.yml`, the lock file, external BTF and upgrades.

The image embeds doona. Add the `native_api` block from honk's [Web UI and APIs](../how-to-start.md#web-ui-and-apis), then open the interface as described in doona's [First sign-in](/doona/first-sign-in).

## Uninstall

From the directory containing `docker-compose.yml`, stop and remove the container:

::: code-group

```sh [sudo]
sudo docker compose down
```

```sh [root]
docker compose down
```

:::

The host directories `/etc/honk` and `/var/lib/honk`, the Compose files and `.env`, and `/etc/tmpfiles.d/honk-container.conf` remain. The downloaded image and `/run/honk-core.lock` also remain; do not delete or replace a lock that another instance may hold.
