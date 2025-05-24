### HarpyHSP - A home server with tools and a modular architecture
### Copyright (C) <2025>  <WauLau>
### This program is free software: you can redistribute it and/or modify
### it under the terms of the GNU General Public License Version 3,
### or any later version

## Example of the .env file. This file stores important variables like access
## ports and VPN endpoints. Docker Files will refer to the .env file. 
## E.g (home/usr/HarpyHSP/.env)
                                
##Songbird Access Port
SONGBIRD_PORT=7860

##PrivacyNest Acees Port (Adguard And ProtonVPN)
PRIVACYNEST_PORT=3000

## ProtonVPN 
# WG endpoint (IP:port) Found in the wireguard.conf file under 
# 'Peer' and 'Endpoint'
PROTONVPN_SERVER=185.159.xxx.xxx:51820
# WG Kill Switch.  0 = Kill Switch Disabled, 1 = Kill Switch Enabled
KILL_SWITCH=1
