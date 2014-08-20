[![MEAN Logo](http://www.mean.io/img/logos/meanlogo.png)](http://mean.io/)
[![WebRTC Logo](http://www.webrtc.org/_/rsrc/1318870658554/config/customLogo.gif?revision=8)](http://www.webrtc.org/)
[![RTCMultiConnection Logo](http://www.rtcmulticonnection.org/images/logo.png)](http://www.rtcmulticonnection.org/)

# OpenHangouts

Complete Installation
==============

Environment variables
-------------

Screensharing requires HTTPS on your website.
First, export your HTTPS certificates to a custom location on your computer, and set the following environment variables to the appropriate paths.

```sh
export NODE_PRIVATEKEY_PATH='path_to_privatekey.pem'
export NODE_CERTIFICATE_PATH='path_to_certificate.pem'
```

Second, export the credentials of your social applications to enable the remote logging.
In example, for Facebook :

```sh
export OPENHANGOUTS_FACEBOOK_APP_ID='xxxxxxxxxxxx'
export OPENHANGOUTS_FACEBOOK_APP_SECRET='xxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
```

Installation
-------------

From the openhangouts repository
------------
Simply clone the project in your web directory

```sh
git clone git@github.com:overlox/openhangouts.git
```

From a clean mean stack installation
------------
Install the mean package with the following command

```sh
mean package openHangouts;
```


Installing the dependencies
-------------

```sh
npm install
```

Running the project
-------------

```sh
grunt
```

## License
[The MIT License](http://opensource.org/licenses/MIT)
