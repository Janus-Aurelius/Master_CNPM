# 1. Chọn base image cho Node.js
FROM node:18-alpine

# 2. Thiết lập working directory
WORKDIR /app

# 3. Copy package.json và package-lock.json (nếu có)
COPY package*.json ./

# 4. Cài đặt dependencies
RUN npm install
RUN npm install -g typescript
RUN npm install express-validator @types/uuid typescript @types/node --save-dev

# 5. Copy toàn bộ source code
COPY . .

# 6. Build ứng dụng
RUN npm run build

# 7. Expose port cho ứng dụng
EXPOSE 3000

# 8. Command để chạy ứng dụng
CMD ["npm", "start"] 