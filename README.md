# 🪽HarpyHSP

> *HarpyHSP (Harpy Home Server Platform)* is a modular, dockerized server architecture made to enable free and open source ressources on accessible hardware or unused pc's. Harpy is built for privacy, automation, AI access, and media control.

To enable a high feature set and performance, harpy is designed to run on a split architecture: a powerful _Artillery Server_ (performant machine for heavier workloads) and a reliable _Endurance Server_ (reliable and efficient machine for clientside).

This way you can use one or multiple old machines, such as your old gaming laptop, to process LLM inference and Media storage, while a more efficient and reliable computer, such as a Rasperry PI, maintains connections, security and client side interactions.

Though designed with split-architecture in mind, Harpy can also be hosted on one instance such as a dedicated server machine or PC.

## ⚙️ Features
Harpy allows interaction with any API, but it includes modified versions or even fully new pipelines custom built for Harpy and its Architecture. If you want to add your own API or docker image, see the 'Adding Custom Tools' section.

### 🦜 Songbird AI

>Songbird is a lightweight yet extremely competent LLM. Based on Qwen3, Somgbird is Fine-tuned and improved with DRL, and is coupled with an intuitive interface for chatting.

SongbirdAI is an AI model and inference tool, inspired by the Cyberpunk 2077 game. Trough Fine-Tuning on Custom(link to datasets) and Public Datasets(link to public datasets) and Deep Reinforcement Learning, songbird is improved and trained for critical thinking, coding and creativity. 

Songbird is trained on the [Qwen3-4b(MoE)](https://github.com/QwenLM/Qwen3?tab=readme-ov-file#qwen3) model, which carries quite a punch with very impressive performance. 

Songbird is always improving, with more specialized data and training Songbirds becomes more powerful. Additionlly Songbird is also scheduled to adapt other Qwen model sizes and different model families.

### 🛡️ PrivacyNest

Network-wide ad/tracker blocking DNS.

### 🦅 Vulture

— Self-hosted streaming/torrent solution.

### 🔎📦 Warbler

— Web UI for recon and analysis tools.

### 🖥️ Unified Dashboard 
- Single web app interface for all tools.

\---

## 🧱 Architecture

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

### 🗃️ Requirements

\- Laptop with Docker & Docker Compose

\- Raspberry Pi 5 (16GB recommended)

\- NVMe SSD + power-stable PSU

\- Access to GitHub repo & CLI

### 🔨 Installation and Setup

\`\`\`bash

git clone [https://github.com/yourname/HarpyHSP.git](https://github.com/yourname/HarpyHSP.git)

cd HarpyHSP

docker-compose up --build
