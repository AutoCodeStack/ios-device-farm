# ios-device-farm

# WORK IN PROGRESS :construction:

# wait for full instruction to run

Project Description - goes here

### Requirements

- NodeJS 16+
- macOS
- Xcode 13+

### Initialize

Open terminal and perform following steps

1. clone this repository `git clone https://github.com/AutoCodeStack/ios-device-farm.git`
2. `cd ios-device-farm`
3. `sh init.sh`

In order to run a WebDriverAgent on iphone devices we need to setup/build for the first time. If you are familiar with Xcode and Signing Capabilities then you do it. Othewise follow below process to configure.

[Real Device Configuration](https://github.com/appium/appium-xcuitest-driver/blob/master/docs/preparation/real-device-config.md)

You can find WebDriverAgent project under below repo only after Initialize command completed

`./ext/WebDriverAgent/WebDriverAgent.xcodeproj`

### Build

```nodejs
npm install
```

### Run

```nodejs
npm run start
```

Now connect a iphone and open http://localhost:9000 in your browser.

![ios-device-farm](https://github.com/AutoCodeStack/ios-device-farm/blob/main/images/idf-screenshot.png)
