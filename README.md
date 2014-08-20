[![OpenHangouts Logo](https://openhangouts-21450.onmodulus.net/system/assets/img/logo.png)](https://openhangouts.uni.me/)

# OpenHangouts

OpenHangouts is a Mean Stack (+socket.io) implementation of the RTCMultiConnection library.
It handles room conferencing for Google Chrome, with screen-sharing, audio and video.
A working demonstration can be found at :
    https://openhangouts.uni.me

### Installation

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

In general :

```sh
export OPENHANGOUTS_SERVICE_NAME_UNDERSCORED_APP_ID='xx'
export OPENHANGOUTS_SERVICE_NAME_UNDERSCORED_APP_SECRET='xx'
```


Installation
-------------

From the openhangouts repository
------------
Simply clone the project in your web directory

```sh
git clone git@github.com:overlox/openhangouts.git
```

Install the package managers

```sh
npm install -g bower
npm install -g grunt-cli
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

Troubleshooting
------------

For problems with the MEAN Stack

    https://github.com/linnovate/mean#troubleshooting


## License
[The MIT License](http://opensource.org/licenses/MIT)
