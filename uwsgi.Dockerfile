FROM python:3-alpine

WORKDIR /usr/src/app

COPY memstash ./memstash
COPY setup.py requirements.txt MANIFEST.in ./

RUN apk add --no-cache postgresql-dev && \
  apk add --no-cache --virtual build-dependencies \
  libffi-dev build-base linux-headers && \
  pip install -r requirements.txt && \
  pip install uwsgi && \
  apk del build-dependencies

RUN adduser -S uwsgi

USER uwsgi

CMD uwsgi --master -s 0.0.0.0:5000 --manage-script-name --mount /=memstash:app
