Reddit Flipbook
===============

One feature that appeals to me in the mobile Reddit app is that one can simply swipe to go to the next Reddit post. On the official desktop website, however, there doesn't seem to be a way to navigate to the next post with a single action (button click or otherwise). As far as I can tell, one either closes a modal and opens another, or one opens posts in separate tabs.

I imagine that there could be other existing desktop apps for browsing Reddit out there that already solve this usability problem, but it seemed like a fun wheel to try my own hand at reinventing.

## Installation

Assuming that you already have Node.js installed:

1. Create a `.env` file in the `server` directory, using `server/.env-template` as a guide.
2. Run `npm install`.

You should then be able to start the server by running `npm start`.

## Endpoints

* `GET /` - Returns `{ "data": "index" }`.
