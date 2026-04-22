# Stage 1: Build the React frontend with Vite
FROM node:22-alpine AS frontend-builder
WORKDIR /src

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy frontend source code and build
COPY . .
RUN npm run build
# Your Vite builds directly to backend/App/wwwroot/

# Stage 2: Build the .NET backend
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-builder
WORKDIR /src

# Copy backend project file and restore dependencies
COPY backend/App/App.csproj backend/App/
RUN dotnet restore backend/App/App.csproj

# Copy backend source code
COPY backend/ backend/

# Copy the built frontend files from the frontend builder
# IMPORTANT: Copy from the path where Vite actually built the files
COPY --from=frontend-builder /src/backend/App/wwwroot /src/backend/App/wwwroot/

# Publish the backend with the new frontend files included
RUN dotnet publish backend/App/App.csproj -c Release -o /app/publish --no-restore

# Stage 3: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Copy the published application
COPY --from=backend-builder /app/publish .

# Set the port to Render's PORT environment variable
CMD ["sh", "-c", "ASPNETCORE_URLS=http://+:${PORT:-10000} dotnet App.dll"]