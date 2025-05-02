# HarpyHSP

**HarpyHSP (Harpy Home Server Platform)** is a modular, dockerized server architecture made to enable free and open source ressources on accessible hardware or unused pc's. Harpy is built for privacy, automation, AI access, and media control.  

 To enable a high feature set and performamce, harpy is designed to run on a split architecture: a powerful *Artillery Server* (performant machine for heavier workloads) and a reliable *Endurance Server* (reliable and efficient machine for clientside). 
 This way you can use one or multiple old machines, such as your old gaming laptop, to process LLM inference and Media storage, while a more efficient and reliable computer, such as a Rasperry PI, maintains connections, security and client side interactions.

Though designed with split-architecture in mind, Harpy can also be hosted on one instance such as a dedicated server machine or PC.

---

## Features

- **Songbird AI** — Run a local LLM with 4-bit quantization.
- **AdGuard Home** — Network-wide ad/tracker blocking DNS.
- **ProtonVPN Tunnel** — Secure outbound traffic.
- **Media Server** — Self-hosted streaming/torrent solution.
- **Pentest Toolkit** — Web UI for recon and analysis tools.
- **Unified Dashboard** — Single web app interface for all tools.

---

## Architecture

**Artillery Server (Laptop):**
- Runs heavy-duty services: AI, media processing, torrenting.
- Interfaces via secure tunnel with Pi.

**Endurance Server (Raspberry Pi 5):**
- Hosts reverse proxy, frontend, VPN, DNS.
- Maintains uptime and acts as the main entry point.

**Stack:**
- Docker & Docker Compose
- NGINX (reverse proxy)
- WireGuard (Pi ↔ Laptop)
- Prometheus + Grafana (monitoring, later)
  
---

## Setup & Deployment

### Requirements

- Laptop with Docker & Docker Compose
- Raspberry Pi 5 (16GB recommended)
- NVMe SSD + power-stable PSU
- Access to GitHub repo & CLI

### Local Dev Setup

```bash
git clone https://github.com/yourname/HarpyHSP.git
cd HarpyHSP
docker-compose up --build
