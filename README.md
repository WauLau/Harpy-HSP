# HarpyHSP

> *HarpyHSP (Harpy Home Server Platform)* is a modular, dockerized server architecture made to enable free and open source ressources on accessible hardware or unused pc's. Harpy is built for privacy, automation, AI access, and media control.

To enable a high feature set and performance, harpy is designed to run on a split architecture: a powerful _Artillery Server_ (performant machine for heavier workloads) and a reliable _Endurance Server_ (reliable and efficient machine for clientside).

This way you can use one or multiple old machines, such as your old gaming laptop, to process LLM inference and Media storage, while a more efficient and reliable computer, such as a Rasperry PI, maintains connections, security and client side interactions.

Though designed with split-architecture in mind, Harpy can also be hosted on one instance such as a dedicated server machine or PC.

## Features
Harpy allows interaction with any API, but it includes modified versions or even fully new pipelines custom built for Harpy and its Architecture. If you want to add your own API or docker image, see the 'Adding Custom Tools' section.

### Songbird AI

— Run a local LLM with 4-bit quantization.

### AdGuard Home

Network-wide ad/tracker blocking DNS.

### ProtonVPN Tunnel

\- Secure outbound traffic.

### Media Server

— Self-hosted streaming/torrent solution.

### Pentest Toolkit

— Web UI for recon and analysis tools.

### Unified Dashboard — Single web app interface for all tools.

\---

## Architecture

\*_Artillery Server (Laptop):_\*

\- Runs heavy-duty services: AI, media processing, torrenting.

\- Interfaces via secure tunnel with Pi.

\*_Endurance Server (Raspberry Pi 5):_\*

\- Hosts reverse proxy, frontend, VPN, DNS.

\- Maintains uptime and acts as the main entry point.

\*_Stack:_\*

\- Docker & Docker Compose

\- NGINX (reverse proxy)

\- WireGuard (Pi ↔ Laptop)

\- Prometheus + Grafana (monitoring, later)

\---

\## Setup & Deployment

### Requirements

\- Laptop with Docker & Docker Compose

\- Raspberry Pi 5 (16GB recommended)

\- NVMe SSD + power-stable PSU

\- Access to GitHub repo & CLI

### Local Dev Setup

\`\`\`bash

git clone [https://github.com/yourname/HarpyHSP.git](https://github.com/yourname/HarpyHSP.git)

cd HarpyHSP

docker-compose up --build
