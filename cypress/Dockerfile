FROM cypress/included:3.4.0

COPY . /e2e
WORKDIR /e2e

RUN yarn install

CMD ["node", "./index.js"]
