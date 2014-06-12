#
FROM ubuntu:14.04
MAINTAINER Daniel Krech <eikeon@eikeon.com>
RUN apt-get -qq update
RUN apt-get -qqy install nodejs-legacy npm
RUN npm install -g bower gulp
ADD . /src
RUN cd /src; bower --allow-root install; npm install
EXPOSE  3000
CMD cd /src ; gulp