FROM mcr.microsoft.com/playwright:focal

# @todo this should not run as root...
USER root

RUN apt-get update \
    && apt-get install -y curl \
    && curl -fsSL 'https://github.com/pnpm/pnpm/releases/download/v6.32.2/pnpm-linuxstatic-x64' -o /usr/local/bin/pnpm \
    && chmod +x /usr/local/bin/pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml /app/

RUN pnpm install --production false --frozen-lockfile

COPY promise-watch.config.ts tsconfig.json /app/

COPY runs /app/runs
