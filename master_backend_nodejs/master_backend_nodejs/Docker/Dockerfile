# 1. Chọn base image
FROM postgres:15

# 2. Thiết lập credentials & DB name
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=secret
ENV POSTGRES_DB=mydb

# 3. Copy các script init vào thư mục initdb
#    Docker-entrypoint sẽ tự chạy tất cả .sql trong đây
COPY schema.sql /docker-entrypoint-initdb.d/01_schema.sql
COPY create_data.sql   /docker-entrypoint-initdb.d/02_data.sql

# 4. Expose port (tùy chọn, để host connect)
EXPOSE 5432

