; SETUP IrönTuner - source on /opt/IronTuner
[Setup]
AppId={{230E0757-913C-49D9-97A4-D9B82C4AC346}}
AppName=Irön Tuner
AppVerName=Irön Tuner 0.260514

AppPublisher=Thomas Hühn
AppPublisherURL=http://www.ohmtal.com/
AppSupportURL=https://github.com/ohmtal/IronTuner
AppUpdatesURL=https://github.com/ohmtal/IronTuner

DefaultDirName={autopf}\IronTuner
DefaultGroupName=Irön Tuner
AllowNoIcons=yes
OutputDir=C:\opt\IronTuner\IronTuner\res
OutputBaseFilename=IronTuner_260514_Setup
Compression=lzma
SolidCompression=yes

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Icons]
Name: "{group}\Irön Tuner"; Filename: "{app}\IronTuner.exe"; WorkingDir: "{app}"
Name: "{commondesktop}\Irön Tuner"; Filename: "{app}\IronTuner.exe"; Tasks: desktopicon; WorkingDir: "{app}"
[Run]
Filename: "{app}\IronTuner.exe"; Description: "{cm:LaunchProgram,Irön Tuner}"; Flags: nowait postinstall skipifsilent

[Files]
Source: "C:\opt\IronTuner\IronTuner\assets\*"; DestDir: "{app}\assets"; Flags: ignoreversion recursesubdirs
Source: "C:\opt\IronTuner\IronTuner\IronTuner.exe"; DestDir: "{app}"; Flags: ignoreversion 
Source: "C:\opt\IronTuner\IronTuner\glew32.dll"; DestDir: "{app}"; Flags: ignoreversion 
Source: "C:\opt\IronTuner\IronTuner\libcurl.dll"; DestDir: "{app}"; Flags: ignoreversion 
Source: "C:\opt\IronTuner\IronTuner\SDL3.dll"; DestDir: "{app}"; Flags: ignoreversion 
Source: "C:\opt\IronTuner\IronTuner\z.dll"; DestDir: "{app}"; Flags: ignoreversion 