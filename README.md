# HarpyHSP

**HarpyHSP (Harpy Home Server Platform)** is a modular, dockerized server architecture built for privacy, automation, AI access, and media control.  
Designed to run on a split architecture: a powerful *Artillery Server* (laptop) and a reliable *Endurance Server* (Raspberry Pi 5).

A modular suite of tools for your local server, and accessible anywhere

|ARTILLERY SERVER <br> *(High Performance)* | ENDURANCE SERVER <br> *(Reliable and Efficient)* |
|:---:|:---:|
| Repurposed Gaming Laptop | Rasperry Pi 5 |
| Old GTX PC | Mini-PC |
| Old Laptop + Gaming PC | Rasperry Pi 5 |
| Dedicated Server Machine| - |

**_Example_** _of diffent architectures_

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
