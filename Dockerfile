# development stage

FROM node:17-alpine as development

WORKDIR /usr/src/app

COPY package.json  ./

RUN npm install

COPY . .

RUN npm run build


# production stage

FROM node:17-alpine as production


WORKDIR /usr/src/app

COPY package.json ./

# Work around for husky
# RUN npm set-script prepare ''

RUN npm install --omit=dev

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3001

RUN echo "bero test"
RUN pwd


CMD ["node", "/usr/src/app/dist/src/main.js"]
