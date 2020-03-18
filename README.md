# EaysCalc Angular project

The first cross-plattform Version of Easycalc Mobile has been build with expo. Now the software is redesigned in the angular framework.

For an easy start the stackblitz.com Webtool was used.

# Cordova
https://liechtenecker.at/blog/angular-zu-android-apk-in-10-schritten/

# Docker Environment

Use docker to get a full cordova environment to compile the Angular softwar with cordova to an android apk.

1. Get docker container
``docker run -it beevelop/cordova bash``

2. clone git repo with app into /docker/cordova
3. Start docker
``docker run -v "/docker/cordova/easycalc:/easycalc" -it beevelop/cordova bash``
4. create empty cordova app

``
cordova create wb-easycalc cc.liemberger.easycalc EasyCalc
cordova platform add android
``

5. merge files properly (see https://liechtenecker.at/blog/angular-zu-android-apk-in-10-schritten/)

