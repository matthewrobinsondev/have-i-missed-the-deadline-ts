# docker/dev.Dockerfile
FROM oven/bun:1.0.7

WORKDIR /app/

COPY package.json ./
COPY bun.lockb ./

RUN bun install

COPY . .


# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at run time
ENV NEXT_TELEMETRY_DISABLED 1

CMD bun run dev