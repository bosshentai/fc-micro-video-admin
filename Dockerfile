FROM node:22.13.0-slim


RUN npm install -g @nestjs/cli@10.4.9


USER node

WORKDIR /home/node/app

CMD ["tail", "-f", "/dev/null"]