FROM gcr.io/cloud-builders/docker

RUN apt-get -y install kubectl

COPY . /src
WORKDIR /src
ENTRYPOINT ["/src/commands.sh"]

CMD ["MUST_SPECIFY_COMMAND"]
