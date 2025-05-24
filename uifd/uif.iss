[Setup]
; 定义安装程序的基本信息
AppId=0A09A1DC-4DEA-F3EE-D5C5-5C1BEC5DD201
AppName=UIF
AppVersion=25.05.24
DefaultDirName={userappdata}\UIF
DefaultGroupName=UIF
OutputBaseFilename=setup
Compression=lzma
SolidCompression=yes

[Languages]
Name: "en"; MessagesFile: "compiler:Default.isl"
Name: "cn"; MessagesFile: "adguard/cn.isl"

[Files]
; 定义要打包的文件
Source: "./saved/uif-windows-amd64/*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
; 定义安装后的快捷方式
Name: "{commondesktop}\UIF"; Filename: "{app}\uif.exe"; IconFilename: "{app}\webs\25.05.24\favicon.ico"


[Registry]
; 例：如果需要在注册表中创建项
; Root: HKCU; Subkey: "Software\UIF"; ValueType: string; ValueData: "SomeValue"

[INI]
; 例：如果需要在 INI 文件中创建项
; Filename: "{app}\settings.ini"; Section: "Settings"; Key: "SomeKey"; String: "SomeValue"

