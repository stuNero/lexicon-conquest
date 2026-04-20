# Stage 1: Build the React frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /src

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Build the .NET backend and bundle frontend output into wwwroot
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-builder
WORKDIR /src

COPY backend/App/App.csproj backend/App/
RUN dotnet restore backend/App/App.csproj

COPY backend/ backend/

RUN dotnet publish backend/App/App.csproj -c Release -o /app/publish --no-restore

# Stage 3: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

COPY --from=backend-builder /app/publish .

CMD ["sh", "-c", "ASPNETCORE_URLS=http://+:${PORT:-10000} dotnet App.dll"]