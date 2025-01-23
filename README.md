# [MJT Services](https://github.com/mjt-services) Tunnel Service 2025

This service acts as a gateway to all remote services that are accessed via [SSH tunnels](https://en.wikipedia.org/wiki/Tunneling_protocol#:~:text=degraded%20transmission%20performance.-,Secure%20Shell%20tunneling,-%5Bedit%5D).

## Environment Configuration

The `.env` file is used to configure environment variables for the project. You should create a `.env` file in the root directory of the project. You can use the following example as a template:

```properties
IMAGE_TAG=mjtdev/tunnel:latest
NAME=tunnel
NETWORK_NAME=mq_network
NATS_URL=ws://mq:9222
NATS_AUTH_TOKEN=<your_nats_auth_token_here>
```

Make sure to replace `your_nats_auth_token_here` with your actual NATS authentication token.

## SSH Key Pair

Generate a new SSH key pair for the tunnel service:

```bash
ssh-keygen -t rsa -b 4096 -f ./.ssh/id_rsa -C "tunnel-service"
```

For detailed documentation, please visit the [project documentation](https://mjt-services.github.io/tunnel-service-2025/).