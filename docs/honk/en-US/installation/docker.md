# Docker

Run honk from the `ghcr.io/daeuniverse/honk` image on [GitHub Container Registry](https://github.com/daeuniverse/honk/pkgs/container/honk). The image contains the musl `full` release binary and the GeoIP and Geosite files pinned by the repository; the build checks every download against its SHA-256 checksum.

Each release is tagged with its version without the `v`, for example `ghcr.io/daeuniverse/honk:0.1.0-beta.4`. `latest` follows formal releases only, never pre-releases. Images are published for linux/amd64 and linux/arm64, and pulling needs no login.

Use the sudo tab if sudo is configured for your account. Use the root tab when already in a root shell.

## 1. Check the host

The container runs privileged in the host's network and PID namespaces, because honk loads and attaches eBPF programs, creates `dae0` and the `daens` namespace, changes sysctls and pins maps on the host's bpffs. It therefore changes the host exactly as a native installation does and provides no isolation.

The host must meet the [kernel requirements](https://github.com/daeuniverse/honk/blob/main/doc/en/how-to-start.md#linux-kernel-requirements), including Linux 6.12+ and a mounted bpffs.

The steps also need [Docker Engine](https://docs.docker.com/engine/install/) with the Compose plugin, and `curl`. Check Compose with the command below; it prints the Compose version when the plugin is installed.

::: code-group

```sh [sudo]
sudo docker compose version
```

```sh [root]
docker compose version
```

:::

## 2. Prepare the configuration

Prepare `/etc/honk/config.dae` and `/var/lib/honk` as described in [Minimal configuration](https://github.com/daeuniverse/honk/blob/main/doc/en/how-to-start.md#minimal-configuration).

The image embeds doona. To enable it, add this block to your configuration, or merge it into an existing `experimental` block:

```dae
experimental {
    native_api {
        enabled: true
        listen: '127.0.0.1:9527'
        password_auth: true
        config_write: true
        ui: 'embedded'
    }
}
```

## 3. Start the container

Before starting the container, stop and disable each native service that is installed. Run the dae command only if dae is installed, and the honk command only if native honk is installed.

::: code-group

```sh [sudo]
sudo systemctl disable --now dae.service
sudo systemctl disable --now honk.service
```

```sh [root]
systemctl disable --now dae.service
systemctl disable --now honk.service
```

:::

Download the repository's `docker-compose.yml` and write the release version to `.env`:

```sh
curl -fLO https://raw.githubusercontent.com/daeuniverse/honk/main/docker-compose.yml
echo 'HONK_VERSION=<version>' > .env   # for example 0.1.0-beta.4
```

If the host uses an external BTF file, set it up as described in step 5 first. Create the lock file, then start the container and follow its logs:

::: code-group

```sh [sudo]
sudo touch /run/honk-core.lock
sudo docker compose up -d
sudo docker compose logs -f
```

```sh [root]
touch /run/honk-core.lock
docker compose up -d
docker compose logs -f
```

:::

The compose file mounts `/sys`, `/etc/honk` and `/var/lib/honk` from the host. The configuration mount replaces the image's direct-only default, and `/var/lib/honk` keeps the runtime state, such as the native API administrator account, across restarts and upgrades.

The container uses the host network, so the web UI listens on the host’s loopback address.

On the honk host, open <http://127.0.0.1:9527/ui/> and create the administrator account on first access.

## 4. Keep the lock file across reboots

The lock-file bind shares the native instance's `/run/honk-core.lock`, preventing containers from taking over an active datapath. Leave this file in place after stopping; never delete, replace or truncate an active lock.

It must exist before automatic container startup on every boot. On systemd hosts, arrange non-truncating boot-time creation:

::: code-group

```sh [sudo]
echo 'f /run/honk-core.lock 0600 root root -' | sudo tee /etc/tmpfiles.d/honk-container.conf
sudo systemd-tmpfiles --create /etc/tmpfiles.d/honk-container.conf
```

```sh [root]
echo 'f /run/honk-core.lock 0600 root root -' > /etc/tmpfiles.d/honk-container.conf
systemd-tmpfiles --create /etc/tmpfiles.d/honk-container.conf
```

:::

On other init systems, create the file without truncation before the container's boot-time start. Direct `docker run` or `podman run` deployments must bind the same lock file too.

## 5. Use an external BTF file (optional)

If the host uses an external raw BTF file instead of `/sys/kernel/btf/vmlinux`, save this as `docker-compose.override.yml` beside `docker-compose.yml`. Compose loads it for every command, including upgrades. Adjust `source` to the host's raw BTF file; the environment variable names the mounted path inside the container:

```yaml
services:
  honk:
    environment:
      HONK_VMLINUX_BTF: /run/honk-vmlinux
    volumes:
      - type: bind
        source: /usr/lib/debug/boot/vmlinux
        target: /run/honk-vmlinux
        read_only: true
        bind:
          create_host_path: false
```

## 6. Reload and inspect

Reload the configuration:

::: code-group

```sh [sudo]
sudo docker compose exec honk honk-core reload
```

```sh [root]
docker compose exec honk honk-core reload
```

:::

The image ships iproute2 and nftables, and the container shares the host's network namespace, so these commands show the host's state:

::: code-group

```sh [sudo]
sudo docker compose exec honk ip rule
sudo docker compose exec honk ip route show table all
sudo docker compose exec honk tc filter show dev <interface> ingress
sudo docker compose exec honk nft list ruleset
```

```sh [root]
docker compose exec honk ip rule
docker compose exec honk ip route show table all
docker compose exec honk tc filter show dev <interface> ingress
docker compose exec honk nft list ruleset
```

:::

## Next steps

- [First sign-in](/doona/first-sign-in): open <http://127.0.0.1:9527/ui/> and create the administrator account.
- [Manage nodes, groups and rules](/doona/routing): add nodes or subscriptions and routing rules; until then all traffic goes direct.
- [Troubleshooting](/doona/troubleshooting): what to check when something does not work.

## 7. Upgrade

Change `HONK_VERSION` in `.env` and recreate the container:

::: code-group

```sh [sudo]
sudo docker compose pull
sudo docker compose up -d
```

```sh [root]
docker compose pull
docker compose up -d
```

:::

In a repository checkout, `docker compose build` (`sudo docker compose build` with sudo) builds the same image from the published release instead of pulling it.

## 8. Uninstall

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
