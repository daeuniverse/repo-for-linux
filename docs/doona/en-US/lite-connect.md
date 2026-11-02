---
editLink: false
lastUpdated: false
---

<div v-pre lang="en-US">

# Connect doona lite {#lite-connect}

Connect an installed or separately hosted lite page to honk's native API. For installation, start with [doona lite](lite.md#lite-install).

## 1. Select the backend {#1-select-the-backend}

Open the lite page. If honk serves it, use its `/ui/` address. With no saved connection, lite detects honk at the page origin. If honk allows anonymous access, lite connects directly; otherwise it opens the matching sign-in form. Select **Use another backend** to enter a different address.

If lite does not detect honk or you choose another backend:

1. Enter the server root in **honk native API root**, for example `http://192.168.1.1:9527`, including any reverse-proxy prefix. Do not include `/ui/` or `/api/v1`, and do not enter a proxy node URL.
2. Select **Continue** to discover the sign-in method.

For a separately hosted page or a hostname, configure [hostname and origin access](install.md#other-origin). If discovery fails, check [sign-in requirements](feature-requirements.md#req-sign-in).

## 2. Sign in {#2-sign-in}

| Form | Action |
| --- | --- |
| **Set up administrator** | Enter **Username**, **Password** and **Confirm password**, then select **Create and sign in**. Use the [account format](first-sign-in.md) and [setup requirements](feature-requirements.md#req-sign-in). |
| **Sign in** | Enter the existing honk administrator's **Username** and **Password**, then select **Sign in**. |
| Token field | Enter the configured secret in **Token**, or leave it empty if honk allows anonymous access, then select **Connect**. |

After connecting, continue with [Common tasks in doona lite](lite-tasks.md). For rejected credentials, use [sign-in troubleshooting](troubleshooting.md#sign-in).

## Explore without a backend {#explore-without-a-backend}

Open the [doona lite demo](https://demo.daeuniverse.org/lite/) to explore sample data without a backend. Changes to the sample data reset when the page reloads. Release builds of lite connect only to honk and do not offer a demo button.

</div>
