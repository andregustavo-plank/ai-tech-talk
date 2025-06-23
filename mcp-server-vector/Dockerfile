# Use the official Python 3.13 image from the Docker Hub
FROM python:3.13

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
# RUN pip install --no-cache-dir -r requirements.txt

# Install uvicorn
RUN pip install uv

# Install Node.js
RUN apt-get update && \
    apt-get install -y nodejs npm && \
    rm -rf /var/lib/apt/lists/*

# Make all ports accessible
EXPOSE 6274

# Run the command to start the server
CMD ["uv", "run", "mcp", "dev", "server.py"]
