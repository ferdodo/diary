FROM node
WORKDIR /diary
COPY package.json .
RUN npm install
RUN npm audit --audit-level=low
COPY . .
RUN npm run build
CMD npm run start