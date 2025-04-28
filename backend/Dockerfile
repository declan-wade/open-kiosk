# Define the base image first
FROM oven/bun:latest AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

FROM base AS build
ENV NODE_ENV=production
COPY --from=prerelease /usr/src/app .
RUN bun run build

# Copy built files
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
#COPY --from=build /usr/src/app/.next/standalone .
#COPY --from=build /usr/src/app/.next/static ./.next/static
COPY --from=build /usr/src/app/package.json .

# Set runtime environment variables
# ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
# ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# run the app
USER bun
EXPOSE 4000/tcp
ENTRYPOINT [ "bun", "run", "start" ]