rm -r node_modules package-lock.json --force

node update.js

npm i

npm run prisma:generate