rm -r node_modules package-lock.json --force

ncu -u

npm i

npm run prisma:generate