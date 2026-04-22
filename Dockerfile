# Stage 1: Build the React frontend with Vite
FROM node:22-alpine AS frontend-builder
WORKDIR /src

# First copy only package files (for better caching)
COPY package*.json ./
RUN npm ci

# Then copy source and build
COPY . .
RUN npm run build

# Stage 2: Build the .NET backend
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-builder
WORKDIR /src

# Copy and restore backend (caches restored packages)
COPY backend/App/App.csproj backend/App/
RUN dotnet restore backend/App/App.csproj

# Copy backend source and frontend build
COPY backend/ backend/
COPY --from=frontend-builder /src/dist /src/backend/App/wwwroot/

# Publish
RUN dotnet publish backend/App/App.csproj -c Release -o /app/publish --no-restore

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=backend-builder /app/publish .

CMD ["sh", "-c", "ASPNETCORE_URLS=http://+:${PORT:-10000} dotnet App.dll"]