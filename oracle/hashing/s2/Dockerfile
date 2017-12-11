FROM python:2.7

RUN apt-get update && apt-get install -y build-essential autoconf libtool && apt-get install git && apt-get install software-properties-common python-software-properties -y

RUN git clone https://github.com/micolous/s2-geometry-library.git

RUN wget https://cmake.org/files/v3.10/cmake-3.10.0.tar.gz && tar -xzvf cmake-3.10.0.tar.gz

RUN cd cmake-3.10.0/ && ./configure --prefix=/opt/cmake && make -j4 && make install

WORKDIR s2-geometry-library/geometry

ENV PATH="$PATH:/opt/cmake/bin/"

RUN cmake . && make -j3 && make install

RUN apt-get install swig -y

WORKDIR python

RUN cmake . && make && make install

ADD . .

ENTRYPOINT python s2-test.py