---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Requirements {#requirements}

Check the gateway and browser before installing doona and honk. For an individual page or action, use [Feature requirements](feature-requirements.md).

## Gateway {#gateway}

Follow honk's [Linux kernel requirements](/honk/how-to-start#linux-kernel-requirements) and [bpffs setup](/honk/how-to-start#bpffs) before starting the backend. Keep console access or another way into the gateway for the first real start: honk changes its networking.

## honk version {#honk-version}

Use a honk build that implements doona's native API contract and includes the `native-api` build feature. A version number alone does not establish compatibility. Without that feature, a build cannot serve the API even with its configuration block.

Choose a compatible honk-core archive using the [installation guide](install.md). The app's [contract pin](https://github.com/Zakkaus/doona/blob/main/contract/api-standardize/SOURCE.md) identifies the API it expects.

On the gateway, run:

```sh
honk-core --version
```

After signing in, compare the running engine version on **System status** with the installed binary. For a missing API or a rejected build, see [native API troubleshooting](troubleshooting.md#no-native-api).

## Browser and source builds {#browser-and-source-builds}

| Component | Requirement |
| --- | --- |
| Browser | Standard-edition build targets: Chrome or Edge 120, Firefox 121, Safari 17 or later; JavaScript target ES2022. |
| Build the app | Node `^22.13.0 \|\| ^24.0.0 \|\| >=26.0.0` and pnpm 11.15.1. |
| Build this documentation site | Node `^22.18.0 \|\| ^24.0.0 \|\| >=26.0.0` and pnpm 11.15.1. |

Node and pnpm are only needed for [development](development.md), not to serve a prebuilt interface. Process-name routing has additional [feature requirements](feature-requirements.md#req-process-routing).

</div>
