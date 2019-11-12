# DJI Ryze Tello PS3 Pad Controller

![screenshot](https://raw.githubusercontent.com/jamOne-/tello-ps3-controller/master/screenshots/2019_11_12.png)

Web application displaying Ryze Tello's state and stream & allowing to control a drone with PS3 pad.

Application uses:

- [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API)
- [socket.io](https://github.com/socketio/socket.io): sending drone state / control commands
- [JSMpeg](https://github.com/phoboslab/jsmpeg): drone stream player using websockets
- [ffmpeg](https://ffmpeg.org)

## Running

0. Install `ffmpeg` and app dependencies:
   ```
   yarn
   ```
1. Build app:

   ```
   yarn build
   yarn server:build
   ```

1. Connect to Tello's WiFi network.
1. Start server:

   ```
   yarn server:start --record-stream  --bitrate=2000k
   ```

1. Navigate to http://localhost:5000 in your browser.

## PS3 Pad controls

- takeoff: press L2 & R2 simultanously
- land: press L1 & R1 simultanously
- move left/right: left stick left/right
- move forward/backward: left stick up/down
- rotate left/right: right stick left/right
- move up/down: right stick up/down

## Help

To detect pad on Windows 10 I had to install [ScpToolkit](https://github.com/nefarius/ScpToolkit).

## Todo

- add drone speed adjustment
- reduce control latency
- reduce stream latency (WebRTC?)
- improve control experience

## Development

- watching front-end changes: `yarn start`
- watching server changes: `yarn server:watch`
- note that you need to restart server in order to see server changes: `yarn start`

## Attribution

[Polygon Background Dark Vectors by Vecteezy](https://www.vecteezy.com/free-vector/polygon-background-dark)
